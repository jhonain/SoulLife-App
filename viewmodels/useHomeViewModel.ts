import { useState, useEffect, useRef } from 'react';
import { fraseService } from '../services/fraseService';
import { speechService } from '../services/speechService';
import { shareService } from '../services/shareService';
import { favoritoService } from '../services/favoritoService';
import { Frase } from '../models/Frase';
import { supabase } from '../lib/supabase';

export function useHomeViewModel() {
  const [frases, setFrases] = useState<Frase[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const viewShotRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      const loggedIn = !!session && !session.user.is_anonymous;
      setIsLoggedIn(loggedIn);
      if (loggedIn && session?.user?.id) {
        loadFavorites(session.user.id);
      }
    });

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!session && !session.user?.is_anonymous;
      setIsLoggedIn(loggedIn);
      if (loggedIn && session?.user?.id) {
        loadFavorites(session.user.id);
      } else {
        setFavorites(new Set());
      }
    });

    fraseService
      .getActiveFrases(0)
      .then((data) => {
        setFrases(data);
        if (data.length < 10) setHasMore(false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => {
      speechService.stop();
      listener.subscription.unsubscribe();
    };
  }, []);

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

  const loadFavorites = async (userId: string) => {
    try {
      const ids = await favoritoService.getFavoritos(userId);
      setFavorites(new Set(ids));
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    }
  };

  const handleFavorite = async (item: Frase) => {
    // Si no tiene sesión registrada mostrar modal
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const newFavorites = new Set(favorites);

    if (newFavorites.has(item.id)) {
      // Quitar favorito
      newFavorites.delete(item.id);
      setFavorites(newFavorites);
      await favoritoService.eliminarFavorito(userId, item.id);
    } else {
      // Agregar favorito
      newFavorites.add(item.id);
      setFavorites(newFavorites);
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
      const newPage = page + 1;
      const newFrases = await fraseService.getActiveFrases(newPage);
      if (newFrases.length < 10) setHasMore(false);
      setFrases((prev) => [...prev, ...newFrases]);
      setPage(newPage);
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
