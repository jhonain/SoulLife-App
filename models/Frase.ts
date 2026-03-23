export interface Frase {
  id: string;
  autor: string;
  image_url: string;
  texto: string;
}

export interface FraseFavorita {
  id: string;
  frase_id: string;
  autor: string;
  texto: string;
  image_url: string;
  categoria: string;
}
