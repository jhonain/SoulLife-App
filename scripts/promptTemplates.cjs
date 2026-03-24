// promptTemplates.cjs
// [MODIFICADO] - Autores variados (40+), pasajes bíblicos de toda la Biblia (65+ libros)
// [MODIFICADO] - Queries de imágenes aleatorios por categoría para evitar repetición
// [MODIFICADO] - Agregadas 6 nuevas categorías: gym, meditation, leadership, love, growth, family

const CATEGORIAS = [
  { id: 2, slug: 'motivation',  nombre_es: 'Motivación',          nombre_en: 'Motivation'       },
  { id: 3, slug: 'biblical',    nombre_es: 'Bíblico',             nombre_en: 'Biblical'         },
  { id: 4, slug: 'gym',         nombre_es: 'Gym & Fitness',       nombre_en: 'Gym & Fitness'    },
  { id: 5, slug: 'meditation',  nombre_es: 'Meditación',          nombre_en: 'Meditation'       },
  { id: 6, slug: 'leadership',  nombre_es: 'Liderazgo',           nombre_en: 'Leadership'       },
  { id: 7, slug: 'love',        nombre_es: 'Amor',                nombre_en: 'Love'             },
  { id: 8, slug: 'growth',      nombre_es: 'Crecimiento Personal', nombre_en: 'Personal Growth' },
  { id: 9, slug: 'family',      nombre_es: 'Familia',             nombre_en: 'Family'           },
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
  gym: [
    'gym workout weights',
    'athlete running sunrise',
    'fitness training motivation',
    'muscle training dark',
    'sport sweat effort',
    'boxing training power',
    'running track athlete',
    'crossfit workout intense',
  ],
  meditation: [
    'meditation zen peaceful',
    'yoga sunrise nature',
    'calm mind water',
    'lotus flower peaceful',
    'mindfulness nature quiet',
    'buddhist temple serene',
    'morning fog nature calm',
    'candle meditation dark',
  ],
  leadership: [
    'business leadership team',
    'mountain peak success',
    'chess strategy planning',
    'sunrise city skyline',
    'road path forward',
    'eagle soaring sky',
    'compass navigation direction',
    'bridge architecture success',
  ],
  love: [
    'couple sunset romantic',
    'heart nature flowers',
    'romantic sunset beach',
    'rose petals soft',
    'hands together love',
    'golden hour warmth',
    'flowers bloom spring',
    'soft light romance',
  ],
  growth: [
    'tree growing nature',
    'seed sprout soil',
    'sunrise new beginning',
    'butterfly transformation nature',
    'mountain climb success',
    'road journey horizon',
    'plant growth light',
    'stairs climb progress',
  ],
  family: [
    'family sunset together',
    'children playing nature',
    'home warm light',
    'parents children walk',
    'family picnic outdoor',
    'hands family together',
    'cozy home winter',
    'grandparents children love',
  ],
};

// Autores por categoría
const AUTORES_MOTIVACION = [
  'Marco Aurelio', 'Sócrates', 'Aristóteles', 'Platón', 'Epicteto',
  'Lao Tzu', 'Confucio', 'Viktor Frankl', 'Friedrich Nietzsche',
  'Albert Camus', 'Jean-Paul Sartre', 'Voltaire',
  'Ralph Waldo Emerson', 'Henry David Thoreau', 'Walt Whitman',
  'Maya Angelou', 'Paulo Coelho', 'Gabriel García Márquez',
  'Pablo Neruda', 'Jorge Luis Borges', 'Isabel Allende',
  'Nelson Mandela', 'Mahatma Gandhi', 'Martin Luther King Jr.',
  'Albert Einstein', 'Stephen Hawking', 'Carl Sagan',
  'Winston Churchill', 'Abraham Lincoln', 'Theodore Roosevelt',
  'Oprah Winfrey', 'Steve Jobs', 'Malala Yousafzai',
  'Dalai Lama', 'Thich Nhat Hanh', 'Eckhart Tolle',
  'C.S. Lewis', 'Blaise Pascal', 'Søren Kierkegaard',
];

const AUTORES_GYM = [
  'Arnold Schwarzenegger', 'Muhammad Ali', 'Michael Jordan',
  'Kobe Bryant', 'LeBron James', 'Serena Williams',
  'Dwayne Johnson', 'David Goggins', 'Conor McGregor',
  'Cristiano Ronaldo', 'Lionel Messi', 'Usain Bolt',
  'Bruce Lee', 'Rocky Balboa', 'Mike Tyson',
];

const AUTORES_LIDERAZGO = [
  'John C. Maxwell', 'Simon Sinek', 'Peter Drucker',
  'Steve Jobs', 'Elon Musk', 'Jeff Bezos',
  'Warren Buffett', 'Bill Gates', 'Jack Welch',
  'Nelson Mandela', 'Winston Churchill', 'Theodore Roosevelt',
  'Sun Tzu', 'Napoleon Bonaparte', 'Abraham Lincoln',
];

const AUTORES_AMOR = [
  'Gabriel García Márquez', 'Pablo Neruda', 'Mario Vargas Llosa',
  'Jorge Luis Borges', 'Isabel Allende', 'Octavio Paz',
  'Victor Hugo', 'William Shakespeare', 'Jane Austen',
  'Oscar Wilde', 'Antoine de Saint-Exupéry', 'Paulo Coelho',
  'Frida Kahlo', 'Rumi', 'Khalil Gibran',
];

const AUTORES_FAMILIA = [
  'Leo Tolstoy', 'Gabriel García Márquez', 'Paulo Coelho',
  'Isabel Allende', 'Mario Vargas Llosa', 'Desmond Tutu',
  'Pope Francis', 'Dalai Lama', 'Mother Teresa',
  'Michael J. Fox', 'Barack Obama', 'Michelle Obama',
];

const AUTORES_CRECIMIENTO = [
  'Tony Robbins', 'Robin Sharma', 'Brian Tracy',
  'Stephen Covey', 'Napoleon Hill', 'Dale Carnegie',
  'Jim Rohn', 'Zig Ziglar', 'Wayne Dyer',
  'Brené Brown', 'Mel Robbins', 'James Clear',
  'Viktor Frankl', 'Eckhart Tolle', 'Deepak Chopra',
];

const AUTORES_MEDITACION = [
  'Buda', 'Dalai Lama', 'Thich Nhat Hanh',
  'Eckhart Tolle', 'Deepak Chopra', 'Jon Kabat-Zinn',
  'Osho', 'Pema Chödrön', 'Jack Kornfield',
  'Tara Brach', 'Mooji', 'Sri Sri Ravi Shankar',
  'Paramahansa Yogananda', 'Swami Vivekananda', 'Krishnamurti',
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

// Mapa de autores por categoría
const AUTORES_POR_CATEGORIA = {
  motivation:  AUTORES_MOTIVACION,
  gym:         AUTORES_GYM,
  meditation:  AUTORES_MEDITACION,
  leadership:  AUTORES_LIDERAZGO,
  love:        AUTORES_AMOR,
  growth:      AUTORES_CRECIMIENTO,
  family:      AUTORES_FAMILIA,
};

// Descripción del tema por categoría para el prompt
const TEMA_POR_CATEGORIA = {
  motivation:  'motivacional e inspiradora general',
  gym:         'sobre gym, fitness, entrenamiento, disciplina física y superación deportiva',
  meditation:  'sobre meditación, paz interior, mindfulness y consciencia',
  leadership:  'sobre liderazgo, visión, estrategia y gestión de equipos',
  love:        'sobre el amor, las relaciones y los sentimientos',
  growth:      'sobre crecimiento personal, superación y desarrollo humano',
  family:      'sobre la familia, los lazos familiares y el hogar',
};

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPexelsQuery(categoriaSlug) {
  const queries = PEXELS_QUERIES[categoriaSlug] ?? ['peaceful nature'];
  return randomItem(queries);
}

function buildPrompt(categoriaSlug) {
  if (categoriaSlug === 'biblical') {
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

  const autores = AUTORES_POR_CATEGORIA[categoriaSlug] ?? AUTORES_MOTIVACION;
  const autor = randomItem(autores);
  const tema = TEMA_POR_CATEGORIA[categoriaSlug] ?? 'inspiradora';

  return `
Genera una frase ${tema} de ${autor}.

Responde ÚNICAMENTE con un objeto JSON puro, sin markdown, sin bloques de código, sin texto extra.

El JSON debe tener exactamente esta estructura:
{
  "autor": "${autor}",
  "categoria": "${categoriaSlug}",
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
