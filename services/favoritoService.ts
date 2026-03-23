// favoritoService.ts
// Servicio para todas las operaciones de favoritos con Supabase
// [CREADO] - Operaciones básicas: getFavoritos, agregarFavorito, eliminarFavorito
// [MODIFICADO] - Agregado getFavoritosCompletos: trae favoritos con JOIN a frases, traducciones y categoría
// [MODIFICADO] - Agregado getFavoritoByFraseId: trae un favorito completo por frase_id (usado en tiempo real)

import { supabase } from '../lib/supabase';
import { FraseFavorita } from '../models/Frase';

// Query reutilizable con todos los JOINs necesarios
const FAVORITO_SELECT = `
  id,
  frase_id,
  frases (
    id,
    autor,
    image_url,
    frases_traduccion (contenido, language),
    categoria_id,
    categoria (
      categoria_traduccion (nombre, language)
    )
  )
`;

// Formatea un item crudo de Supabase a FraseFavorita
function formatFavorito(item: any): FraseFavorita {
  const frase = item.frases;
  const traduccion =
    frase.frases_traduccion.find((t: any) => t.language === 'es') ||
    frase.frases_traduccion[0];
  const categoriaNombre =
    frase.categoria?.categoria_traduccion?.find((t: any) => t.language === 'es')?.nombre ||
    'General';

  return {
    id: item.id,
    frase_id: item.frase_id,
    autor: frase.autor,
    texto: traduccion?.contenido ?? 'Sin traducción disponible.',
    image_url: frase.image_url,
    categoria: categoriaNombre,
  };
}

export const favoritoService = {

  // Trae solo los IDs de favoritos del usuario
  async getFavoritos(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favoritos')
      .select('frase_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map((f: any) => f.frase_id);
  },

  // Trae todos los favoritos completos con JOIN a frases, traducciones y categoría
  async getFavoritosCompletos(userId: string): Promise<FraseFavorita[]> {
    const { data, error } = await supabase
      .from('favoritos')
      .select(FAVORITO_SELECT)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(formatFavorito);
  },

  // Trae un favorito completo por frase_id — usado para agregar en tiempo real
  async getFavoritoByFraseId(userId: string, fraseId: string): Promise<FraseFavorita | null> {
    const { data, error } = await supabase
      .from('favoritos')
      .select(FAVORITO_SELECT)
      .eq('user_id', userId)
      .eq('frase_id', fraseId)
      .single();

    if (error || !data) return null;
    return formatFavorito(data);
  },

  // Inserta un nuevo favorito
  async agregarFavorito(userId: string, fraseId: string): Promise<void> {
    const { error } = await supabase
      .from('favoritos')
      .insert({ user_id: userId, frase_id: fraseId });

    if (error) throw error;
  },

  // Elimina un favorito por user_id y frase_id
  async eliminarFavorito(userId: string, fraseId: string): Promise<void> {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('user_id', userId)
      .eq('frase_id', fraseId);

    if (error) throw error;
  },

};
