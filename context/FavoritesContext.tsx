// FavoritesContext.tsx
// Contexto global para compartir el estado de favoritos entre HomeScreen y FavoriteScreen
// [CREADO] - Permite que al eliminar un favorito en FavoriteScreen
//            el corazón se desmarca en tiempo real en HomeScreen
// [MODIFICADO] - Agregado registerOnFavoriteAdded para notificar a FavoriteScreen
//                cuando se agrega un favorito desde HomeScreen en tiempo real

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { favoritoService } from '../services/favoritoService';

type OnFavoriteAddedCallback = (fraseId: string) => void;

interface FavoritesContextType {
  favorites: Set<string>;
  addFavorite: (fraseId: string) => void;
  removeFavorite: (fraseId: string) => void;
  loadFavorites: (userId: string) => Promise<void>;
  clearFavorites: () => void;
  registerOnFavoriteAdded: (cb: OnFavoriteAddedCallback) => void;
  unregisterOnFavoriteAdded: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  addFavorite: () => {},
  removeFavorite: () => {},
  loadFavorites: async () => {},
  clearFavorites: () => {},
  registerOnFavoriteAdded: () => {},
  unregisterOnFavoriteAdded: () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Callback que useFavoritesViewModel registra para recibir notificaciones
  const onFavoriteAddedRef = useRef<OnFavoriteAddedCallback | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (session?.user && !session.user.is_anonymous) {
        loadFavorites(session.user.id);
      }
    });

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
    // Notificar a useFavoritesViewModel para que cargue los datos completos
    if (onFavoriteAddedRef.current) {
      onFavoriteAddedRef.current(fraseId);
    }
  };

  const removeFavorite = (fraseId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(fraseId);
      return next;
    });
  };

  const clearFavorites = () => setFavorites(new Set());

  // Registro del callback desde useFavoritesViewModel
  const registerOnFavoriteAdded = (cb: OnFavoriteAddedCallback) => {
    onFavoriteAddedRef.current = cb;
  };

  const unregisterOnFavoriteAdded = () => {
    onFavoriteAddedRef.current = null;
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      loadFavorites,
      clearFavorites,
      registerOnFavoriteAdded,
      unregisterOnFavoriteAdded,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}
