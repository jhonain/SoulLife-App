// useAdminViewModel.ts
// ViewModel del panel de administración
// [CREADO] - Maneja estadísticas, gestión de frases y estado del panel admin

import { useState, useEffect } from 'react';
import { adminService, AdminStats, FraseAdmin } from '../services/adminService';
import { Alert } from 'react-native';

export function useAdminViewModel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [frases, setFrases] = useState<FraseAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFrases, setLoadingFrases] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'frases'>('stats');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFrases = async () => {
    setLoadingFrases(true);
    try {
      const data = await adminService.getFrasesAdmin();
      setFrases(data);
    } catch (err) {
      console.error('Error cargando frases:', err);
    } finally {
      setLoadingFrases(false);
    }
  };

  const handleTabChange = (tab: 'stats' | 'frases') => {
    setActiveTab(tab);
    if (tab === 'frases' && frases.length === 0) {
      loadFrases();
    }
  };

  const handleToggleFrase = async (frase: FraseAdmin) => {
    const nuevoEstado = !frase.is_active;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    Alert.alert(
      `${nuevoEstado ? 'Activar' : 'Desactivar'} frase`,
      `¿Deseas ${accion} esta frase?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: nuevoEstado ? 'Activar' : 'Desactivar',
          style: nuevoEstado ? 'default' : 'destructive',
          onPress: async () => {
            // Actualizar estado local inmediatamente
            setFrases((prev) =>
              prev.map((f) => f.id === frase.id ? { ...f, is_active: nuevoEstado } : f)
            );
            await adminService.toggleFraseActiva(frase.id, nuevoEstado);
          },
        },
      ]
    );
  };

  const handleEliminarFrase = async (frase: FraseAdmin) => {
    Alert.alert(
      'Eliminar frase',
      `¿Estás seguro que deseas eliminar esta frase de "${frase.autor}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setFrases((prev) => prev.filter((f) => f.id !== frase.id));
            await adminService.eliminarFrase(frase.id);
            // Actualizar stats
            await loadStats();
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    await loadStats();
    if (activeTab === 'frases') await loadFrases();
  };

  return {
    stats,
    frases,
    loading,
    loadingFrases,
    activeTab,
    handleTabChange,
    handleToggleFrase,
    handleEliminarFrase,
    handleRefresh,
  };
}
