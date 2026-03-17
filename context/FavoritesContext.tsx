// FavoritesContext.tsx
// Contexto global para compartir el estado de favoritos entre HomeScreen y FavoriteScreen
// [CREADO] - Permite que al eliminar un favorito en FavoriteScreen
//            el corazón se desmarca en tiempo real en HomeScreen

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { favoritoService } from '../services/favoritoService';

interface FavoritesContextType {
  favorites: Set<string>;
  addFavorite: (fraseId: string) => void;
  removeFavorite: (fraseId: string) => void;
  loadFavorites: (userId: string) => Promise<void>;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  addFavorite: () => {},
  removeFavorite: () => {},
  loadFavorites: async () => {},
  clearFavorites: () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Cargar favoritos al iniciar si hay sesión
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (session?.user && !session.user.is_anonymous) {
        loadFavorites(session.user.id);
      }
    });

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && !session.user.is_anonymous) {
        loadFavorites(session.user.id);
      } else {
        clearFavorites();
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadFavorites = async (userId: string) => {
    try {
      const ids = await favoritoService.getFavoritos(userId);
      setFavorites(new Set(ids));
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    }
  };

  const addFavorite = (fraseId: string) => {
    setFavorites((prev) => new Set([...prev, fraseId]));
  };

  const removeFavorite = (fraseId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(fraseId);
      return next;
    });
  };

  const clearFavorites = () => setFavorites(new Set());

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, loadFavorites, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}
