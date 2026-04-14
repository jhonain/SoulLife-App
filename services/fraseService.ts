// fraseService.ts
// Servicio para operaciones de frases con Supabase
// [CREADO] - getActiveFraseIds, getFrasesByIds
// [MODIFICADO] - Agregado buscarFrases para búsqueda por texto/autor
// [MODIFICADO] - Agregado getFrasesExplore para grid con categoría y paginación

import { supabase } from '../lib/supabase';
import { Frase } from '../models/Frase';

export interface FraseExplore extends Frase {
  categoria_id: number;
  categoria: string;
}

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

  // Trae frases para el grid de Explorar con categoría y paginación
  async getFrasesExplore(page: number = 0, limit: number = 20, categoriaId?: number): Promise<FraseExplore[]> {
    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('frases')
      .select(`
        id, autor, image_url,
        categoria_id,
        categoria (
          categoria_traduccion (nombre, language)
        ),
        frases_traduccion (contenido, language)
      `)
      .eq('is_active', true)
      .range(from, to);

    if (categoriaId) {
      query = query.eq('categoria_id', categoriaId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map((item: any) => {
      const traduccion =
        item.frases_traduccion?.find((t: any) => t.language === 'es') ||
        item.frases_traduccion?.[0];
      const categoriaNombre =
        item.categoria?.categoria_traduccion?.find((t: any) => t.language === 'es')?.nombre ||
        'General';

      return {
        id: item.id,
        autor: item.autor,
        image_url: item.image_url,
        texto: traduccion?.contenido ?? '',
        categoria_id: item.categoria_id,
        categoria: categoriaNombre,
      };
    });
  },

  // Búsqueda de frases por texto o autor
  async buscarFrases(query: string): Promise<FraseExplore[]> {
    if (!query.trim()) return [];

    const { data, error } = await supabase
      .from('frases')
      .select(`
        id, autor, image_url,
        categoria_id,
        categoria (
          categoria_traduccion (nombre, language)
        ),
        frases_traduccion (contenido, language)
      `)
      .eq('is_active', true)
      .or(`autor.ilike.%${query}%`)
      .limit(30);

    if (error) throw error;

    // También buscar en traducciones
    const { data: dataTrad, error: errorTrad } = await supabase
      .from('frases_traduccion')
      .select(`
        frase_id,
        frases!inner (
          id, autor, image_url, is_active,
          categoria_id,
          categoria (
            categoria_traduccion (nombre, language)
          ),
          frases_traduccion (contenido, language)
        )
      `)
      .eq('language', 'es')
      .eq('frases.is_active', true)
      .ilike('contenido', `%${query}%`)
      .limit(30);

    if (errorTrad) throw errorTrad;

    // Combinar resultados sin duplicados
    const resultadosPorAutor = data.map((item: any) => formatFraseExplore(item));
    const resultadosPorTexto = (dataTrad ?? []).map((item: any) => formatFraseExplore(item.frases));

    const todos = [...resultadosPorAutor, ...resultadosPorTexto];
    const unicos = Array.from(new Map(todos.map((f) => [f.id, f])).values());
    return unicos;
  },
};

function formatFraseExplore(item: any): FraseExplore {
  const traduccion =
    item.frases_traduccion?.find((t: any) => t.language === 'es') ||
    item.frases_traduccion?.[0];
  const categoriaNombre =
    item.categoria?.categoria_traduccion?.find((t: any) => t.language === 'es')?.nombre ||
    'General';

  return {
    id: item.id,
    autor: item.autor,
    image_url: item.image_url,
    texto: traduccion?.contenido ?? '',
    categoria_id: item.categoria_id,
    categoria: categoriaNombre,
  };
}
