// useFavoritesViewModel.ts
// ViewModel de la pantalla Favoritos
// [MODIFICADO] - Usa FavoritesContext para sincronizar corazones con HomeScreen en tiempo real

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { favoritoService } from '../services/favoritoService';
import { useFavoritesContext } from '../context/FavoritesContext';

export interface FraseFavorita {
  id: string;
  frase_id: string;
  autor: string;
  texto: string;
  image_url: string;
  categoria: string;
}

export function useFavoritesViewModel() {
  const [favorites, setFavorites] = useState<FraseFavorita[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Contexto global para sincronizar corazones con HomeScreen
  const { removeFavorite: removeFavoriteFromContext } = useFavoritesContext();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      const loggedIn = !!session && !session.user.is_anonymous;
      setIsLoggedIn(loggedIn);
      if (loggedIn && session?.user?.id) {
        setCurrentUserId(session.user.id);
        loadFavorites(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!session && !session.user?.is_anonymous;
      setIsLoggedIn(loggedIn);
      if (loggedIn && session?.user?.id) {
        setCurrentUserId(session.user.id);
        loadFavorites(session.user.id);
      } else {
        setCurrentUserId(null);
        setFavorites([]);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadFavorites = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select(`
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
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = data.map((item: any) => {
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
      });

      setFavorites(formatted);
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!currentUserId) return;
    setRefreshing(true);
    await loadFavorites(currentUserId);
    setRefreshing(false);
  };

  const removeFavorite = async (favoritoId: string, fraseId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    // Actualizar lista local de esta pantalla
    setFavorites((prev) => prev.filter((f) => f.id !== favoritoId));

    // Actualizar contexto global → desmarca corazón en HomeScreen inmediatamente
    removeFavoriteFromContext(fraseId);

    // Eliminar de Supabase
    await favoritoService.eliminarFavorito(userId, fraseId);
  };

  const categorias = ['Todos', ...Array.from(new Set(favorites.map((f) => f.categoria)))];

  const favoritosFiltrados = categoriaSeleccionada === 'Todos'
    ? favorites
    : favorites.filter((f) => f.categoria === categoriaSeleccionada);

  return {
    favorites: favoritosFiltrados,
    totalFavorites: favorites.length,
    loading,
    refreshing,
    isLoggedIn,
    categorias,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    removeFavorite,
    handleRefresh,
  };
}
