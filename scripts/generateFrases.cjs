// generateFrases.cjs
// Script principal para generar frases con Groq (llama) + imágenes de Pexels/Unsplash
// e insertarlas automáticamente en Supabase
// [MODIFICADO] - Cambiado de Gemini a Groq (llama-3.3-70b-versatile)
// [MODIFICADO] - Integrado Unsplash junto a Pexels — 50/50 aleatorio para más variedad

require('dotenv').config();

const Groq = require('groq-sdk');
const { createClient } = require('@supabase/supabase-js');
const { CATEGORIAS, getPexelsQuery, buildPrompt } = require('./promptTemplates.cjs');

// ─── Configuración ───────────────────────────────────────────
const FRASES_A_GENERAR = 5;
const DELAY_MS = 1500;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Helpers ─────────────────────────────────────────────────

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomCategoria() {
  return CATEGORIAS[Math.floor(Math.random() * CATEGORIAS.length)];
}

// ─── Groq: Generar frase ──────────────────────────────────────

async function generarFrase(categoriaSlug) {
  const prompt = buildPrompt(categoriaSlug);

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'Eres un asistente que genera frases inspiradoras. Responde SIEMPRE con JSON puro, sin markdown, sin bloques de código, sin texto extra.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.9,
    max_tokens: 300,
  });

  const text = completion.choices[0]?.message?.content?.trim() ?? '';

  const clean = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const parsed = JSON.parse(clean);

  if (!parsed.autor || !parsed.es || !parsed.en || !parsed.categoria) {
    throw new Error(`JSON incompleto: ${clean}`);
  }

  return parsed;
}

// ─── Pexels: Buscar imagen ────────────────────────────────────

async function buscarImagenPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=portrait`;

  const response = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY },
  });

  if (!response.ok) throw new Error(`Pexels error: ${response.status}`);

  const data = await response.json();
  const fotos = data.photos;

  if (!fotos || fotos.length === 0) throw new Error('Pexels no devolvió imágenes');

  const foto = fotos[Math.floor(Math.random() * fotos.length)];
  return foto.src.large ?? foto.src.medium;
}

// ─── Unsplash: Buscar imagen ──────────────────────────────────

async function buscarImagenUnsplash(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=15&orientation=portrait`;

  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
  });

  if (!response.ok) throw new Error(`Unsplash error: ${response.status}`);

  const data = await response.json();
  const fotos = data.results;

  if (!fotos || fotos.length === 0) throw new Error('Unsplash no devolvió imágenes');

  const foto = fotos[Math.floor(Math.random() * fotos.length)];
  return foto.urls.regular;
}

// ─── Imagen: 50/50 Pexels o Unsplash con fallback ────────────

async function buscarImagen(categoriaSlug) {
  const query = getPexelsQuery(categoriaSlug);
  const usarPexels = Math.random() < 0.5;

  try {
    if (usarPexels) {
      const url = await buscarImagenPexels(query);
      console.log(`   🖼️  Imagen obtenida de Pexels`);
      return url;
    } else {
      const url = await buscarImagenUnsplash(query);
      console.log(`   🖼️  Imagen obtenida de Unsplash`);
      return url;
    }
  } catch (err) {
    // Si falla uno intenta con el otro
    console.log(`   ⚠️  Fallback a ${usarPexels ? 'Unsplash' : 'Pexels'}`);
    if (usarPexels) {
      const url = await buscarImagenUnsplash(query);
      console.log(`   🖼️  Imagen obtenida de Unsplash (fallback)`);
      return url;
    } else {
      const url = await buscarImagenPexels(query);
      console.log(`   🖼️  Imagen obtenida de Pexels (fallback)`);
      return url;
    }
  }
}

// ─── Supabase: Insertar frase ────────────────────────────────

async function insertarFrase(autor, categoriaId, imageUrl, textoEs, textoEn) {
  const { data: fraseData, error: fraseError } = await supabase
    .from('frases')
    .insert({ autor, categoria_id: categoriaId, image_url: imageUrl, is_active: true })
    .select('id')
    .single();

  if (fraseError) throw new Error(`Error insertando frase: ${fraseError.message}`);

  const fraseId = fraseData.id;

  const { error: tradError } = await supabase
    .from('frases_traduccion')
    .insert([
      { frase_id: fraseId, language: 'es', contenido: textoEs },
      { frase_id: fraseId, language: 'en', contenido: textoEn },
    ]);

  if (tradError) throw new Error(`Error insertando traducciones: ${tradError.message}`);

  return fraseId;
}

// ─── Supabase: Verificar duplicado ───────────────────────────

async function fraseYaExiste(textoEs) {
  const { data } = await supabase
    .from('frases_traduccion')
    .select('id')
    .eq('language', 'es')
    .ilike('contenido', textoEs.trim())
    .maybeSingle();

  return data !== null;
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 Iniciando generación de ${FRASES_A_GENERAR} frases...\n`);

  let exitosas = 0;
  let fallidas = 0;

  for (let i = 0; i < FRASES_A_GENERAR; i++) {
    const categoria = randomCategoria();
    console.log(`[${i + 1}/${FRASES_A_GENERAR}] Generando frase — categoría: ${categoria.nombre_es}`);

    try {
      // 1. Generar frase con Groq
      const frase = await generarFrase(categoria.slug);

      // Verificar si ya existe en Supabase
      const existe = await fraseYaExiste(frase.es);
      if (existe) {
        console.log(`   ⚠️  Frase duplicada, saltando...\n`);
        fallidas++;
        continue;
      }
      console.log(`   ✅ Frase: "${frase.es.substring(0, 50)}..."`);
      console.log(`   👤 Autor: ${frase.autor}`);

      // 2. Buscar imagen — 50% Pexels, 50% Unsplash
      const imageUrl = await buscarImagen(categoria.slug);

      // 3. Insertar en Supabase
      const fraseId = await insertarFrase(
        frase.autor,
        categoria.id,
        imageUrl,
        frase.es,
        frase.en
      );
      console.log(`   💾 Guardada en Supabase — ID: ${fraseId}\n`);

      exitosas++;
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}\n`);
      fallidas++;
    }

    if (i < FRASES_A_GENERAR - 1) await delay(DELAY_MS);
  }

  console.log('─────────────────────────────────');
  console.log(`✅ Exitosas: ${exitosas}`);
  console.log(`❌ Fallidas: ${fallidas}`);
  console.log('─────────────────────────────────\n');
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
