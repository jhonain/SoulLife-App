// useExploreViewModel.ts
// ViewModel de la pantalla Explorar
// [MODIFICADO] - Implementado búsqueda, filtro por categoría y grid con paginación

import { useState, useEffect, useCallback } from 'react';
import { fraseService, FraseExplore } from '../services/fraseService';
import { supabase } from '../lib/supabase';

interface Categoria {
  id: number;
  slug: string;
  nombre: string;
  icon: string;
}

const LIMIT = 20;

export function useExploreViewModel() {
  const [frases, setFrases] = useState<FraseExplore[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadCategorias();
    loadFrases(0, null);
  }, []);

  const loadCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categoria')
        .select(`id, slug, icon, categoria_traduccion (nombre, language)`)
        .order('id');

      if (error) throw error;

      const formatted = data
        .filter((c: any) => c.slug !== 'all')
        .map((c: any) => ({
          id: c.id,
          slug: c.slug,
          icon: c.icon,
          nombre: c.categoria_traduccion?.find((t: any) => t.language === 'es')?.nombre ?? c.slug,
        }));

      setCategorias(formatted);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const loadFrases = async (pageNum: number, categoriaId: number | null) => {
    if (pageNum === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await fraseService.getFrasesExplore(pageNum, LIMIT, categoriaId ?? undefined);

      if (pageNum === 0) {
        setFrases(data);
      } else {
        setFrases((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === LIMIT);
      setPage(pageNum);
    } catch (err) {
      console.error('Error cargando frases:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleCategoriaSelect = (categoriaId: number | null) => {
    setCategoriaSeleccionada(categoriaId);
    setSearchQuery('');
    loadFrases(0, categoriaId);
  };

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      loadFrases(0, categoriaSeleccionada);
      return;
    }

    setSearching(true);
    try {
      const data = await fraseService.buscarFrases(query);
      setFrases(data);
      setHasMore(false);
    } catch (err) {
      console.error('Error buscando:', err);
    } finally {
      setSearching(false);
    }
  }, [categoriaSeleccionada]);

  const loadMore = () => {
    if (!hasMore || loadingMore || searchQuery.trim()) return;
    loadFrases(page + 1, categoriaSeleccionada);
  };

  return {
    frases,
    categorias,
    categoriaSeleccionada,
    searchQuery,
    loading,
    loadingMore,
    searching,
    hasMore,
    handleCategoriaSelect,
    handleSearch,
    loadMore,
  };
}
