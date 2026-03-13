import { supabase } from '../lib/supabase';
import { Frase } from '../models/Frase';

export const fraseService = {
  
  async getActiveFrases(page: number = 0, limit: number = 10): Promise<Frase[]> {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('frases')
      .select(`
        id, autor, image_url, is_active,
        frases_traduccion (contenido, language)
      `)
      .eq('is_active', true)
      .range(from, to);

    if (error) throw error;

    return data.map((item: any) => {
      const traduccion =
        item.frases_traduccion.find((t: any) => t.language === 'es') ||
        item.frases_traduccion[0];
      return {
        id: item.id,
        autor: item.autor,
        image_url: item.image_url,
        texto: traduccion?.contenido ?? 'Sin traducción disponible.',
      };
    });
  },
};
