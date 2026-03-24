// AdminScreen.tsx
// Pantalla del panel de administración
// [CREADO] - Panel admin con estadísticas y gestión de frases

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  BarChart2, BookOpen, Users, Heart,
  Eye, EyeOff, Trash2, ArrowLeft,
  CheckCircle, XCircle,
} from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAdminViewModel } from '../viewmodels/useAdminViewModel';
import { FraseAdmin } from '../services/adminService';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export default function AdminScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('app_metadata:', JSON.stringify(data.session?.user?.app_metadata));
    });
  }, []);

  const {
    stats,
    frases,
    loading,
    loadingFrases,
    activeTab,
    handleTabChange,
    handleToggleFrase,
    handleEliminarFrase,
    handleRefresh,
  } = useAdminViewModel();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <View style={{
      flex: 1,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      gap: 8,
    }}>
      <Icon size={24} color={color ?? colors.gold} strokeWidth={1.5} />
      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 22 }}>{value}</Text>
      <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'center' }}>{label}</Text>
    </View>
  );


  const renderFrase = ({ item }: { item: FraseAdmin }) => (
    <View style={{
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 12,
      padding: 14,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: item.is_active ? colors.border : colors.dangerBorder,
      opacity: item.is_active ? 1 : 0.6,
    }}>
      {/* Estado + Categoría */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 6,
          backgroundColor: colors.goldBg,
        }}>
          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '600' }}>{item.categoria}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {item.is_active
            ? <CheckCircle size={14} color="#22C55E" strokeWidth={1.5} />
            : <XCircle size={14} color={colors.danger} strokeWidth={1.5} />
          }
          <Text style={{ color: item.is_active ? '#22C55E' : colors.danger, fontSize: 11 }}>
            {item.is_active ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
      </View>

      {/* Texto */}
      <Text style={{ color: colors.text, fontSize: 13, lineHeight: 20, marginBottom: 6 }} numberOfLines={2}>
        {item.texto}
      </Text>

      {/* Autor */}
      <Text style={{ color: colors.textMuted, fontSize: 12, fontStyle: 'italic', marginBottom: 12 }}>
        — {item.autor}
      </Text>

      {/* Botones */}
      <View style={{ flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: colors.borderStrong, paddingTop: 10 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
            backgroundColor: item.is_active ? colors.dangerBg : 'rgba(34,197,94,0.1)',
            borderWidth: 1,
            borderColor: item.is_active ? colors.dangerBorder : 'rgba(34,197,94,0.3)',
          }}
          activeOpacity={0.7}
          onPress={() => handleToggleFrase(item)}
        >
          {item.is_active
            ? <EyeOff size={14} color={colors.danger} strokeWidth={1.5} />
            : <Eye size={14} color="#22C55E" strokeWidth={1.5} />
          }
          <Text style={{ color: item.is_active ? colors.danger : '#22C55E', fontSize: 12 }}>
            {item.is_active ? 'Desactivar' : 'Activar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.dangerBg,
            borderWidth: 1,
            borderColor: colors.dangerBorder,
          }}
          activeOpacity={0.7}
          onPress={() => handleEliminarFrase(item)}
        >
          <Trash2 size={14} color={colors.danger} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={24} color={colors.text} strokeWidth={1.5} />
        </TouchableOpacity>
        <View>
          <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 22 }}>Panel Admin</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Soul-Life</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 8 }}>
        {[
          { key: 'stats', label: 'Estadísticas', icon: BarChart2 },
          { key: 'frases', label: 'Frases', icon: BookOpen },
        ].map(({ key, label, icon: Icon }) => (
          <TouchableOpacity
            key={key}
            onPress={() => handleTabChange(key as any)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 6,
              backgroundColor: activeTab === key ? colors.gold : colors.card,
              borderWidth: 1,
              borderColor: activeTab === key ? colors.gold : colors.borderStrong,
            }}
            activeOpacity={0.7}
          >
            <Icon size={16} color={activeTab === key ? '#0A0A0F' : colors.textMuted} strokeWidth={1.5} />
            <Text style={{ color: activeTab === key ? '#0A0A0F' : colors.textMuted, fontSize: 13, fontWeight: activeTab === key ? '700' : '400' }}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab: Estadísticas */}
      {activeTab === 'stats' && stats && (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} tintColor={colors.gold} colors={[colors.gold]} />}
        >
          <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>
            Resumen general
          </Text>

          {/* Fila 1 */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <StatCard icon={BookOpen} label="Total frases" value={stats.totalFrases} />
            <StatCard icon={Users} label="Usuarios" value={stats.totalUsuarios} />
          </View>

          {/* Fila 2 */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <StatCard icon={CheckCircle} label="Frases activas" value={stats.frasesActivas} color="#22C55E" />
            <StatCard icon={XCircle} label="Inactivas" value={stats.frasesInactivas} color={colors.danger} />
          </View>

          {/* Fila 3 */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <StatCard icon={Heart} label="Total favoritos" value={stats.totalFavoritos} color={colors.danger} />
            <View style={{ flex: 1 }} />
          </View>
        </ScrollView>
      )}

      {/* Tab: Frases */}
      {activeTab === 'frases' && (
        loadingFrases ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.gold} />
          </View>
        ) : (
          <FlatList
            data={frases}
            keyExtractor={(item) => item.id}
            renderItem={renderFrase}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 4, paddingBottom: 40 }}
            refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} tintColor={colors.gold} colors={[colors.gold]} />}
          />
        )
      )}
    </View>
  );
}
