import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, LogOut, LogIn, UserPlus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      <View className="flex-1 justify-center items-center bg-[#0A0A0F]">
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  // Usuario NO logueado
  if (!isLoggedIn) {
    return (
      <View
        className="flex-1 bg-[#0A0A0F] justify-center items-center px-8"
        style={{ paddingTop: insets.top }}
      >
        {/* Ícono */}
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
        >
          <User size={48} color="#D4AF37" strokeWidth={1.5} />
        </View>

        <Text className="text-white font-bold text-2xl text-center mb-2">
          Únete a Soul-Life
        </Text>
        <Text className="text-center mb-10" style={{ color: '#666', lineHeight: 22 }}>
          Crea una cuenta para guardar tus frases favoritas y personalizar tu experiencia.
        </Text>

        {/* Botón Registro */}
        <TouchableOpacity
          className="w-full py-4 rounded-xl items-center mb-3 flex-row justify-center gap-2"
          style={{ backgroundColor: '#D4AF37' }}
          activeOpacity={0.8}
          onPress={() => router.push('/register' as any)}
        >
          <UserPlus size={18} color="#0A0A0F" strokeWidth={2} />
          <Text className="font-bold" style={{ color: '#0A0A0F', fontSize: 15 }}>
            Crear cuenta gratis
          </Text>
        </TouchableOpacity>

        {/* Botón Login */}
        <TouchableOpacity
          className="w-full py-4 rounded-xl items-center flex-row justify-center gap-2"
          style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2A2A3E' }}
          activeOpacity={0.8}
          onPress={() => router.push('/login' as any)}
        >
          <LogIn size={18} color="#D4AF37" strokeWidth={1.5} />
          <Text style={{ color: '#D4AF37', fontSize: 15 }}>
            Ya tengo cuenta
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Usuario logueado
  return (
    <View
      className="flex-1 bg-[#0A0A0F]"
      style={{ paddingTop: insets.top }}
    >
      {/* Header perfil */}
      <View className="items-center px-8 py-10">
        {/* Avatar */}
        {user?.avatar_url ? (
          <Image
            source={{ uri: user.avatar_url }}
            className="w-24 h-24 rounded-full mb-4"
            style={{ borderWidth: 2, borderColor: '#D4AF37' }}
          />
        ) : (
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 2, borderColor: '#D4AF37' }}
          >
            <User size={40} color="#D4AF37" strokeWidth={1.5} />
          </View>
        )}

        {/* Nombre */}
        <Text className="text-white font-bold text-2xl text-center">
          {user?.full_name ?? 'Usuario'}
        </Text>

        {/* Email */}
        <Text className="mt-1 text-center" style={{ color: '#666', fontSize: 14 }}>
          {user?.email}
        </Text>
      </View>

      {/* Separador */}
      <View className="mx-6 h-px" style={{ backgroundColor: '#1A1A2E' }} />

      {/* Botón cerrar sesión */}
      <View className="px-6 mt-8">
        <TouchableOpacity
          className="w-full py-4 rounded-xl flex-row items-center justify-center gap-2"
          style={{ backgroundColor: 'rgba(255,80,80,0.1)', borderWidth: 1, borderColor: 'rgba(255,80,80,0.2)' }}
          activeOpacity={0.8}
          onPress={confirmSignOut}
        >
          <LogOut size={18} color="#FF5050" strokeWidth={1.5} />
          <Text style={{ color: '#FF5050', fontSize: 15, fontWeight: '600' }}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
