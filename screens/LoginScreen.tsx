import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Eye, EyeOff } from 'lucide-react-native';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';

export default function LoginScreen() {
  const router = useRouter();
  const { loading, error, signInWithEmail, signInWithGoogle, clearError, validateLogin } = useAuthViewModel();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    clearError();
    const { errors, hasErrors } = validateLogin(email, password);
    setFieldErrors(errors);
    if (hasErrors) return;

    const result = await signInWithEmail(email.trim(), password);
    if (result) {
      router.replace('/(tabs)');
    }
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0A0A0F]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Título */}
        <View className="items-center mb-10">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(212,175,55,0.15)' }}
          >
            <Heart size={32} color="#D4AF37" strokeWidth={1.5} />
          </View>
          <Text className="text-white font-bold" style={{ fontSize: 26 }}>
            Bienvenido de vuelta
          </Text>
          <Text className="text-center mt-2" style={{ color: '#666', fontSize: 14 }}>
            Inicia sesión para ver tus favoritos
          </Text>
        </View>

        {/* Botón Google */}
        <TouchableOpacity
          className="w-full py-4 rounded-xl flex-row items-center justify-center mb-6"
          style={{ backgroundColor: '#1A1A2E', borderWidth: 1, borderColor: '#2A2A3E' }}
          activeOpacity={0.8}
          onPress={handleGoogle}
          disabled={loading}
        >
          <Text className="text-white font-semibold text-base mr-2">G</Text>
          <Text className="text-white font-semibold" style={{ fontSize: 15 }}>
            Continuar con Google
          </Text>
        </TouchableOpacity>

        {/* Separador */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px" style={{ backgroundColor: '#2A2A3E' }} />
          <Text className="mx-4" style={{ color: '#555', fontSize: 13 }}>o inicia con email</Text>
          <View className="flex-1 h-px" style={{ backgroundColor: '#2A2A3E' }} />
        </View>

        {/* Error global */}
        {error && (
          <View className="w-full py-3 px-4 rounded-xl mb-4" style={{ backgroundColor: 'rgba(255,80,80,0.1)', borderWidth: 1, borderColor: 'rgba(255,80,80,0.3)' }}>
            <Text style={{ color: '#FF5050', fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {/* Campo Email */}
        <Text className="text-white mb-2 ml-1" style={{ fontSize: 13 }}>Correo electrónico</Text>
        <TextInput
          className="w-full py-4 px-4 rounded-xl"
          style={{ backgroundColor: '#12121A', borderWidth: 1, borderColor: fieldErrors.email ? '#FF5050' : '#2A2A3E', color: '#fff', fontSize: 15 }}
          placeholder="tu@correo.com"
          placeholderTextColor="#444"
          value={email}
          onChangeText={(v) => { setEmail(v); setFieldErrors(p => ({ ...p, email: '' })); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {fieldErrors.email ? (
          <Text className="mt-1 mb-3 ml-1" style={{ color: '#FF5050', fontSize: 12 }}>{fieldErrors.email}</Text>
        ) : <View className="mb-4" />}

        {/* Campo Contraseña */}
        <Text className="text-white mb-2 ml-1" style={{ fontSize: 13 }}>Contraseña</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            className="w-full py-4 px-4 rounded-xl"
            style={{ backgroundColor: '#12121A', borderWidth: 1, borderColor: fieldErrors.password ? '#FF5050' : '#2A2A3E', color: '#fff', fontSize: 15, paddingRight: 48 }}
            placeholder="Tu contraseña"
            placeholderTextColor="#444"
            value={password}
            onChangeText={(v) => { setPassword(v); setFieldErrors(p => ({ ...p, password: '' })); }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}
            onPress={() => setShowPassword(p => !p)}
            activeOpacity={0.7}
          >
            {showPassword
              ? <EyeOff size={20} color="#666" strokeWidth={1.5} />
              : <Eye size={20} color="#666" strokeWidth={1.5} />
            }
          </TouchableOpacity>
        </View>
        {fieldErrors.password ? (
          <Text className="mt-1 mb-2 ml-1" style={{ color: '#FF5050', fontSize: 12 }}>{fieldErrors.password}</Text>
        ) : <View className="mb-2" />}

        {/* Olvidé mi contraseña */}
        <TouchableOpacity className="self-end mb-6" activeOpacity={0.7}>
          <Text style={{ color: '#D4AF37', fontSize: 13 }}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Botón Iniciar sesión */}
        <TouchableOpacity
          className="w-full py-4 rounded-xl items-center mb-4"
          style={{ backgroundColor: '#D4AF37', opacity: loading ? 0.7 : 1 }}
          activeOpacity={0.8}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#0A0A0F" />
            : <Text className="font-bold" style={{ color: '#0A0A0F', fontSize: 15 }}>Iniciar sesión</Text>
          }
        </TouchableOpacity>

        {/* Crear cuenta */}
        <View className="flex-row justify-center items-center mt-2">
          <Text style={{ color: '#666', fontSize: 14 }}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
            <Text style={{ color: '#D4AF37', fontSize: 14, fontWeight: '600' }}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
