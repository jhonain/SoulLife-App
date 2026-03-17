import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, LogOut, LogIn, UserPlus, Sun, Moon, Smartphone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';
import { useAppTheme } from '../context/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'system';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: any }[] = [
  { mode: 'light', label: 'Claro', icon: Sun },
  { mode: 'dark', label: 'Oscuro', icon: Moon },
  { mode: 'system', label: 'Automático', icon: Smartphone },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, themeMode, setThemeMode } = useAppTheme();
  const { user, loading, isLoggedIn, handleSignOut } = useProfileViewModel();

  const confirmSignOut = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: handleSignOut },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  // Bloque de selector de tema (compartido entre logueado y no logueado)
  const ThemeSelector = () => (
    <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
      <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>
        Apariencia
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {THEME_OPTIONS.map(({ mode, label, icon: Icon }) => {
          const isSelected = themeMode === mode;
          return (
            <TouchableOpacity
              key={mode}
              onPress={() => setThemeMode(mode)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                backgroundColor: isSelected ? colors.goldBg : colors.card,
                borderWidth: 1,
                borderColor: isSelected ? colors.gold : colors.borderStrong,
              }}
            >
              <Icon
                size={20}
                color={isSelected ? colors.gold : colors.textMuted}
                strokeWidth={1.5}
              />
              <Text style={{ fontSize: 12, fontWeight: isSelected ? '700' : '400', color: isSelected ? colors.gold : colors.textMuted }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  if (!isLoggedIn) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingTop: 60 }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 24, backgroundColor: colors.goldBgLight }}>
            <User size={48} color={colors.gold} strokeWidth={1.5} />
          </View>
          <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 24, textAlign: 'center', marginBottom: 8 }}>
            Únete a Soul-Life
          </Text>
          <Text style={{ color: colors.textMuted, textAlign: 'center', marginBottom: 40, lineHeight: 22 }}>
            Crea una cuenta para guardar tus frases favoritas y personalizar tu experiencia.
          </Text>
          <TouchableOpacity
            style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: colors.gold }}
            activeOpacity={0.8}
            onPress={() => router.push('/register' as any)}
          >
            <UserPlus size={18} color="#0A0A0F" strokeWidth={2} />
            <Text style={{ fontWeight: 'bold', color: '#0A0A0F', fontSize: 15 }}>Crear cuenta gratis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.borderStrong }}
            activeOpacity={0.8}
            onPress={() => router.push('/login' as any)}
          >
            <LogIn size={18} color={colors.gold} strokeWidth={1.5} />
            <Text style={{ color: colors.gold, fontSize: 15 }}>Ya tengo cuenta</Text>
          </TouchableOpacity>
        </View>

        {/* Separador */}
        <View style={{ marginHorizontal: 24, height: 1, backgroundColor: colors.border, marginTop: 40 }} />

        {/* Selector de tema también visible sin cuenta */}
        <ThemeSelector />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header perfil */}
      <View style={{ alignItems: 'center', paddingHorizontal: 32, paddingVertical: 40 }}>
        {user?.avatar_url ? (
          <Image
            source={{ uri: user.avatar_url }}
            style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 16, borderWidth: 2, borderColor: colors.gold }}
          />
        ) : (
          <View style={{ width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 16, backgroundColor: colors.goldBg, borderWidth: 2, borderColor: colors.gold }}>
            <User size={40} color={colors.gold} strokeWidth={1.5} />
          </View>
        )}
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 24, textAlign: 'center' }}>
          {user?.full_name ?? 'Usuario'}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 4, textAlign: 'center' }}>
          {user?.email}
        </Text>
      </View>

      {/* Separador */}
      <View style={{ marginHorizontal: 24, height: 1, backgroundColor: colors.border }} />

      {/* Selector de tema */}
      <ThemeSelector />

      {/* Separador */}
      <View style={{ marginHorizontal: 24, height: 1, backgroundColor: colors.border, marginTop: 24 }} />

      {/* Botón cerrar sesión */}
      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <TouchableOpacity
          style={{ width: '100%', paddingVertical: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.dangerBorder }}
          activeOpacity={0.8}
          onPress={confirmSignOut}
        >
          <LogOut size={18} color={colors.danger} strokeWidth={1.5} />
          <Text style={{ color: colors.danger, fontSize: 15, fontWeight: '600' }}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
