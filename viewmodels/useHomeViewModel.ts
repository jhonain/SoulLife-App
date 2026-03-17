// useHomeViewModel.ts
// ViewModel principal de la pantalla Home
// [MODIFICADO] - Implementado shuffle de frases por sesión con Fisher-Yates
// [MODIFICADO] - Supabase Realtime para detectar frases nuevas sin reabrir la app
// [MODIFICADO] - Favoritos ahora usan FavoritesContext compartido con FavoriteScreen

import { useState, useEffect, useRef } from 'react';
import { fraseService } from '../services/fraseService';
import { speechService } from '../services/speechService';
import { shareService } from '../services/shareService';
import { favoritoService } from '../services/favoritoService';
import { Frase } from '../models/Frase';
import { supabase } from '../lib/supabase';
import { useFavoritesContext } from '../context/FavoritesContext';

const BATCH_SIZE = 10;

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useHomeViewModel() {
  const [frases, setFrases] = useState<Frase[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Favoritos desde contexto global compartido
  const { favorites, addFavorite, removeFavorite: removeFavoriteFromContext } = useFavoritesContext();

  const shuffledIds = useRef<string[]>([]);
  const loadedCount = useRef(0);
  const viewShotRefs = useRef<{ [key: string]: any }>({});
  const realtimeChannel = useRef<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      const loggedIn = !!session && !session.user.is_anonymous;
      setIsLoggedIn(loggedIn);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!session && !session.user?.is_anonymous;
      setIsLoggedIn(loggedIn);
    });

    initFrases();
    suscribirRealtime();

    return () => {
      speechService.stop();
      listener.subscription.unsubscribe();
      if (realtimeChannel.current) {
        supabase.removeChannel(realtimeChannel.current);
      }
    };
  }, []);

  // ─── Supabase Realtime ────────────────────────────────────────
  const suscribirRealtime = () => {
    realtimeChannel.current = supabase
      .channel('frases-nuevas')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'frases',
          filter: 'is_active=eq.true',
        },
        async (payload: any) => {
          const nuevaFraseId = payload.new?.id;
          if (!nuevaFraseId) return;

          if (shuffledIds.current.includes(nuevaFraseId)) return;

          try {
            const [nuevaFrase] = await fraseService.getFrasesByIds([nuevaFraseId]);
            if (!nuevaFrase) return;

            shuffledIds.current = [...shuffledIds.current, nuevaFraseId];
            setFrases((prev) => [...prev, nuevaFrase]);
          } catch (err) {
            console.error('Realtime error:', err);
          }
        }
      )
      .subscribe();
  };

  // ─── Init ────────────────────────────────────────────────────
  const initFrases = async () => {
    try {
      const allIds = await fraseService.getActiveFraseIds();
      shuffledIds.current = shuffleArray(allIds);
      loadedCount.current = 0;

      const firstBatchIds = shuffledIds.current.slice(0, BATCH_SIZE);
      loadedCount.current = BATCH_SIZE;

      if (firstBatchIds.length === 0) {
        setHasMore(false);
        return;
      }

      const firstFrases = await fraseService.getFrasesByIds(firstBatchIds);
      setFrases(firstFrases);

      if (loadedCount.current >= shuffledIds.current.length) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error iniciando frases:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Handlers ────────────────────────────────────────────────
  const handleSpeak = async (item: Frase) => {
    if (speakingId === item.id) {
      await speechService.stop();
      setSpeakingId(null);
      return;
    }
    if (speakingId) await speechService.stop();
    setSpeakingId(item.id);
    speechService.speak(
      item.texto,
      item.autor,
      () => setSpeakingId(null),
      () => setSpeakingId(null),
    );
  };

  const handleShare = async (item: Frase) => {
    const ref = viewShotRefs.current[item.id];
    if (ref) await shareService.shareAsImage(ref);
  };

  const handleFavorite = async (item: Frase) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    if (favorites.has(item.id)) {
      // Quitar favorito — actualiza contexto global inmediatamente
      removeFavoriteFromContext(item.id);
      await favoritoService.eliminarFavorito(userId, item.id);
    } else {
      // Agregar favorito — actualiza contexto global inmediatamente
      addFavorite(item.id);
      await favoritoService.agregarFavorito(userId, item.id);
    }
  };

  const handleScrollChange = () => {
    speechService.stop();
    setSpeakingId(null);
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const from = loadedCount.current;
      const to = from + BATCH_SIZE;
      const batchIds = shuffledIds.current.slice(from, to);

      if (batchIds.length === 0) {
        setHasMore(false);
        return;
      }

      const newFrases = await fraseService.getFrasesByIds(batchIds);
      loadedCount.current = to;

      if (to >= shuffledIds.current.length) setHasMore(false);

      setFrases((prev) => [...prev, ...newFrases]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    frases,
    loading,
    loadingMore,
    hasMore,
    speakingId,
    favorites,
    showAuthModal,
    viewShotRefs,
    setShowAuthModal,
    handleSpeak,
    handleShare,
    handleFavorite,
    handleScrollChange,
    loadMore,
  };
}
