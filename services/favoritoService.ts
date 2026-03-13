import { supabase } from '../lib/supabase';

export const favoritoService = {

  async getFavoritos(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favoritos')
      .select('frase_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map((f: any) => f.frase_id);
  },

  async agregarFavorito(userId: string, fraseId: string): Promise<void> {
    const { error } = await supabase
      .from('favoritos')
      .insert({ user_id: userId, frase_id: fraseId });

    if (error) throw error;
  },

  async eliminarFavorito(userId: string, fraseId: string): Promise<void> {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('user_id', userId)
      .eq('frase_id', fraseId);

    if (error) throw error;
  },

};
