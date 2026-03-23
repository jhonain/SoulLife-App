// promptTemplates.cjs
// [MODIFICADO] - Autores variados (40+), pasajes bíblicos de toda la Biblia (65+ libros)
// [MODIFICADO] - Queries de imágenes aleatorios por categoría para evitar repetición

const CATEGORIAS = [
  { id: 2, slug: 'motivation', nombre_es: 'Motivación', nombre_en: 'Motivation' },
  { id: 3, slug: 'biblical',   nombre_es: 'Bíblico',    nombre_en: 'Biblical'   },
];

// Múltiples queries por categoría para variar imágenes
const PEXELS_QUERIES = {
  motivation: [
    'sunrise mountains nature',
    'forest light peaceful',
    'ocean waves calm',
    'desert sky stars',
    'waterfall nature green',
    'snowy mountain peak',
    'golden field sunset',
    'misty forest morning',
  ],
  biblical: [
    'light rays church window',
    'candle dark peaceful',
    'cross sunset sky',
    'dove sky clouds',
    'olive tree nature',
    'desert sunrise holy',
    'calm lake reflection',
    'ancient stone path',
  ],
};

// Autores variados
const AUTORES_MOTIVACION = [
  'Marco Aurelio', 'Sócrates', 'Aristóteles', 'Platón', 'Epicteto',
  'Lao Tzu', 'Confucio', 'Buda', 'Viktor Frankl', 'Friedrich Nietzsche',
  'Albert Camus', 'Jean-Paul Sartre', 'Simone de Beauvoir', 'Voltaire',
  'Ralph Waldo Emerson', 'Henry David Thoreau', 'Walt Whitman',
  'Maya Angelou', 'Toni Morrison', 'Paulo Coelho', 'Gabriel García Márquez',
  'Octavio Paz', 'Pablo Neruda', 'Jorge Luis Borges', 'Isabel Allende',
  'Nelson Mandela', 'Mahatma Gandhi', 'Martin Luther King Jr.',
  'Marie Curie', 'Albert Einstein', 'Stephen Hawking', 'Carl Sagan',
  'Winston Churchill', 'Abraham Lincoln', 'Theodore Roosevelt',
  'Oprah Winfrey', 'Steve Jobs', 'Malala Yousafzai',
  'Dalai Lama', 'Thich Nhat Hanh', 'Eckhart Tolle',
  'C.S. Lewis', 'G.K. Chesterton', 'Blaise Pascal', 'Søren Kierkegaard',
];

// Libros bíblicos del Antiguo y Nuevo Testamento
const LIBROS_BIBLICOS = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
  'Josué', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
  '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester', 'Job',
  'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares',
  'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel',
  'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas',
  'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
  'Mateo', 'Marcos', 'Lucas', 'Juan',
  'Hechos', 'Romanos', '1 Corintios', '2 Corintios',
  'Gálatas', 'Efesios', 'Filipenses', 'Colosenses',
  '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo',
  'Tito', 'Filemón', 'Hebreos', 'Santiago',
  '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan',
  'Judas', 'Apocalipsis',
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Query aleatorio de Pexels por categoría
function getPexelsQuery(categoriaSlug) {
  const queries = PEXELS_QUERIES[categoriaSlug] ?? ['peaceful nature'];
  return randomItem(queries);
}

function buildPrompt(categoriaSlug) {
  const esBiblico = categoriaSlug === 'biblical';

  if (esBiblico) {
    const libro = randomItem(LIBROS_BIBLICOS);
    return `
Genera un versículo o frase inspiradora del libro de ${libro} de la Biblia.

Responde ÚNICAMENTE con un objeto JSON puro, sin markdown, sin bloques de código, sin texto extra.

El JSON debe tener exactamente esta estructura:
{
  "autor": "referencia bíblica exacta como ${libro} 3:16",
  "categoria": "biblical",
  "es": "versículo en español completo e inspirador",
  "en": "versículo en inglés, traducción natural"
}

Reglas:
- Usa un versículo REAL del libro de ${libro}
- La referencia debe ser exacta (libro capítulo:versículo)
- El versículo debe ser completo y entre 10 y 50 palabras
- Solo devuelve el JSON puro
`.trim();
  }

  const autor = randomItem(AUTORES_MOTIVACION);
  return `
Genera una frase motivacional e inspiradora de ${autor}.

Responde ÚNICAMENTE con un objeto JSON puro, sin markdown, sin bloques de código, sin texto extra.

El JSON debe tener exactamente esta estructura:
{
  "autor": "${autor}",
  "categoria": "motivation",
  "es": "frase en español inspiradora y completa",
  "en": "frase en inglés, traducción natural no literal"
}

Reglas:
- La frase debe ser auténtica o muy representativa del estilo de ${autor}
- Entre 10 y 40 palabras
- Inspiradora y profunda
- Solo devuelve el JSON puro
`.trim();
}

module.exports = { CATEGORIAS, getPexelsQuery, buildPrompt };
