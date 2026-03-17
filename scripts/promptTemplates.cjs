// promptTemplates.cjs
// Configuración de prompts para Gemini y búsquedas de imágenes por categoría

const CATEGORIAS = [
  { id: 2, slug: 'motivation', nombre_es: 'Motivación', nombre_en: 'Motivation' },
  { id: 3, slug: 'biblical',   nombre_es: 'Bíblico',    nombre_en: 'Biblical'   },
];

const PEXELS_QUERY = {
  motivation: 'peaceful sunrise nature mountains',
  biblical:   'light church spiritual nature calm',
};

function buildPrompt(categoriaSlug) {
  const esBiblico = categoriaSlug === 'biblical';

  return `
Genera una frase ${esBiblico ? 'bíblica o de la Biblia' : 'motivacional'} inspiradora.

Responde ÚNICAMENTE con un objeto JSON sin markdown, sin bloques de código, sin texto extra. Solo el JSON puro.

El JSON debe tener exactamente esta estructura:
{
  "autor": "nombre del autor o referencia bíblica como Salmos 23:1",
  "categoria": "${categoriaSlug}",
  "es": "frase en español, inspiradora y completa",
  "en": "frase en inglés, traducción natural no literal"
}

Reglas:
- La frase debe ser original, inspiradora y entre 10 y 40 palabras
- El autor debe ser real o una referencia bíblica válida (ej: Juan 3:16)
- ${esBiblico ? 'Usa versículos reales de la Biblia' : 'Usa autores conocidos como Rumi, Gandhi, Einstein, etc'}
- NO uses frases repetidas ni inventes autores
- Solo devuelve el JSON puro
`.trim();
}

module.exports = { CATEGORIAS, PEXELS_QUERY, buildPrompt };
