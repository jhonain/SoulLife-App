// useFavoritesViewModel.ts
// ViewModel de la pantalla Favoritos
// [MODIFICADO] - Usa FavoritesContext para sincronizar corazones con HomeScreen en tiempo real
// [MODIFICADO] - Registra callback en FavoritesContext para agregar favoritos
//                en tiempo real cuando se marcan desde HomeScreen sin recargar
// [MODIFICADO] - Fix eliminación: usa frase_id para filtrar correctamente el estado
// [MODIFICADO] - Agregado useEffect para sincronizar lista cuando se desmarca desde Home
// [MODIFICADO] - Queries movidas a favoritoService — ViewModel solo maneja estado

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { favoritoService } from '../services/favoritoService';
import { useFavoritesContext } from '../context/FavoritesContext';
import { FraseFavorita } from '../models/Frase';

export function useFavoritesViewModel() {
  const [allFavorites, setAllFavorites] = useState<FraseFavorita[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const {
    favorites: favoritesIds,
    removeFavorite: removeFavoriteFromContext,
    registerOnFavoriteAdded,
    unregisterOnFavoriteAdded,
  } = useFavoritesContext();

  // Sincronizar lista cuando el contexto cambia
  // Si se desmarca desde Home → el ID desaparece del Set → se elimina de la lista
  useEffect(() => {
    if (favoritesIds.size === 0 && allFavorites.length === 0) return;
    setAllFavorites((prev) => prev.filter((f) => favoritesIds.has(f.frase_id)));
  }, [favoritesIds]);

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
        setAllFavorites([]);
        setLoading(false);
      }
    });

    // Registrar callback para agregar favorito en tiempo real desde HomeScreen
    registerOnFavoriteAdded(async (fraseId: string) => {
      await agregarFavoritoEnTiempoReal(fraseId);
    });

    return () => {
      listener.subscription.unsubscribe();
      unregisterOnFavoriteAdded();
    };
  }, []);

  // ─── Carga todos los favoritos completos ─────────────────────
  const loadFavorites = async (userId: string) => {
    setLoading(true);
    try {
      const data = await favoritoService.getFavoritosCompletos(userId);
      setAllFavorites(data);
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Agrega favorito en tiempo real desde HomeScreen ─────────
  const agregarFavoritoEnTiempoReal = async (fraseId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;

      const nuevaFrase = await favoritoService.getFavoritoByFraseId(userId, fraseId);
      if (!nuevaFrase) return;

      setAllFavorites((prev) => {
        if (prev.some((f) => f.frase_id === fraseId)) return prev;
        return [nuevaFrase, ...prev];
      });
    } catch (err) {
      console.error('Error agregando favorito en tiempo real:', err);
    }
  };

  // ─── Refresh manual ──────────────────────────────────────────
  const handleRefresh = async () => {
    if (!currentUserId) return;
    setRefreshing(true);
    await loadFavorites(currentUserId);
    setRefreshing(false);
  };

  // ─── Eliminar favorito ───────────────────────────────────────
  const removeFavorite = useCallback(async (favoritoId: string, fraseId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    // Actualizar estado local inmediatamente
    setAllFavorites((prev) => prev.filter((f) => f.frase_id !== fraseId));

    // Desmarcar corazón en HomeScreen
    removeFavoriteFromContext(fraseId);

    // Eliminar de Supabase
    await favoritoService.eliminarFavorito(userId, fraseId);
  }, [removeFavoriteFromContext]);

  const categorias = ['Todos', ...Array.from(new Set(allFavorites.map((f) => f.categoria)))];

  const favoritosFiltrados = categoriaSeleccionada === 'Todos'
    ? allFavorites
    : allFavorites.filter((f) => f.categoria === categoriaSeleccionada);

  return {
    favorites: favoritosFiltrados,
    totalFavorites: allFavorites.length,
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
