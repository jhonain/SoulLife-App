// adminService.ts
// Servicio para operaciones de administración
// [CREADO] - Estadísticas, gestión de frases y usuarios para el panel admin

import { supabase } from '../lib/supabase';

export interface AdminStats {
  totalFrases: number;
  frasesActivas: number;
  frasesInactivas: number;
  totalUsuarios: number;
  totalFavoritos: number;
}

export interface FraseAdmin {
  id: string;
  autor: string;
  categoria: string;
  is_active: boolean;
  created_at: string;
  texto: string;
}

export const adminService = {

  // Trae estadísticas generales de la app
  async getStats(): Promise<AdminStats> {
    const [frases, usuarios, favoritos] = await Promise.all([
      supabase.from('frases').select('is_active'),
      supabase.from('user_profile').select('id'),
      supabase.from('favoritos').select('id'),
    ]);

    const todasFrases = frases.data ?? [];
    const activas = todasFrases.filter((f: any) => f.is_active).length;

    return {
      totalFrases: todasFrases.length,
      frasesActivas: activas,
      frasesInactivas: todasFrases.length - activas,
      totalUsuarios: usuarios.data?.length ?? 0,
      totalFavoritos: favoritos.data?.length ?? 0,
    };
  },

  // Trae todas las frases con datos para administrar
  async getFrasesAdmin(): Promise<FraseAdmin[]> {
    const { data, error } = await supabase
      .from('frases')
      .select(`
        id,
        autor,
        is_active,
        created_at,
        categoria (
          categoria_traduccion (nombre, language)
        ),
        frases_traduccion (contenido, language)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((item: any) => {
      const traduccion =
        item.frases_traduccion?.find((t: any) => t.language === 'es') ||
        item.frases_traduccion?.[0];
      const categoria =
        item.categoria?.categoria_traduccion?.find((t: any) => t.language === 'es')?.nombre ||
        'General';

      return {
        id: item.id,
        autor: item.autor,
        categoria,
        is_active: item.is_active,
        created_at: item.created_at,
        texto: traduccion?.contenido ?? 'Sin traducción',
      };
    });
  },

  // Activa o desactiva una frase
  async toggleFraseActiva(fraseId: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('frases')
      .update({ is_active: isActive })
      .eq('id', fraseId);

    if (error) throw error;
  },

  // Elimina una frase permanentemente
  async eliminarFrase(fraseId: string): Promise<void> {
    const { error } = await supabase
      .from('frases')
      .delete()
      .eq('id', fraseId);

    if (error) throw error;
  },

};
