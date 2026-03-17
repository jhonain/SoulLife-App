import { supabase } from '../lib/supabase';
import { Frase } from '../models/Frase';

export const fraseService = {

  // Trae solo los IDs de todas las frases activas (liviano)
  async getActiveFraseIds(): Promise<string[]> {
    const { data, error } = await supabase
      .from('frases')
      .select('id')
      .eq('is_active', true);

    if (error) throw error;
    return data.map((item: any) => item.id);
  },

  // Trae frases por un array de IDs específicos (respeta el orden)
  async getFrasesByIds(ids: string[]): Promise<Frase[]> {
    if (ids.length === 0) return [];

    const { data, error } = await supabase
      .from('frases')
      .select(`
        id, autor, image_url, is_active,
        frases_traduccion (contenido, language)
      `)
      .in('id', ids);

    if (error) throw error;

    // Respetar el orden del array de IDs que pasamos
    const map = new Map(data.map((item: any) => [item.id, item]));
    return ids
      .map((id) => map.get(id))
      .filter(Boolean)
      .map((item: any) => {
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
