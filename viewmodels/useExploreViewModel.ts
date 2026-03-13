import { useState } from 'react';
import { Frase } from '../models/Frase';

export function useExploreViewModel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Frase[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: implementar búsqueda en Supabase
  };

  return {
    searchQuery,
    results,
    loading,
    handleSearch,
  };
}
