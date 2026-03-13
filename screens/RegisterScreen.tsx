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

export default function RegisterScreen() {
  const router = useRouter();
  const { loading, error, signUpWithEmail, signInWithGoogle, clearError, validateRegister } = useAuthViewModel();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    clearError();
    const { errors, hasErrors } = validateRegister(email, password, username, confirmPassword);
    setFieldErrors(errors);
    if (hasErrors) return;

    const result = await signUpWithEmail(email.trim(), password, username.trim());
    if (result) {
      setSuccess(true);
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return null;
    if (pass.length < 6) return { label: 'Muy débil', color: '#FF5050', width: '25%' };
    if (pass.length < 8) return { label: 'Débil', color: '#FF8C00', width: '50%' };
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass)) return { label: 'Fuerte', color: '#22C55E', width: '100%' };
    return { label: 'Media', color: '#D4AF37', width: '75%' };
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
  };

  if (success) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0A0A0F] px-8">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(212,175,55,0.15)' }}
        >
          <Heart size={32} color="#D4AF37" fill="#D4AF37" strokeWidth={1.5} />
        </View>
        <Text className="text-white font-bold text-2xl text-center mb-3">
          ¡Cuenta creada!
        </Text>
        <Text className="text-center mb-8" style={{ color: '#888', lineHeight: 22 }}>
          Revisa tu correo para confirmar tu cuenta y luego inicia sesión.
        </Text>
        <TouchableOpacity
          className="w-full py-4 rounded-xl items-center"
          style={{ backgroundColor: '#D4AF37' }}
          onPress={() => router.replace('/login' as any)}
          activeOpacity={0.8}
        >
          <Text className="font-bold" style={{ color: '#0A0A0F', fontSize: 15 }}>
            Ir a iniciar sesión
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            Únete a Soul-Life
          </Text>
          <Text className="text-center mt-2" style={{ color: '#666', fontSize: 14 }}>
            Guarda tus frases favoritas y mucho más
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
          <Text className="mx-4" style={{ color: '#555', fontSize: 13 }}>o regístrate con email</Text>
          <View className="flex-1 h-px" style={{ backgroundColor: '#2A2A3E' }} />
        </View>

        {/* Error global */}
        {error && (
          <View className="w-full py-3 px-4 rounded-xl mb-4" style={{ backgroundColor: 'rgba(255,80,80,0.1)', borderWidth: 1, borderColor: 'rgba(255,80,80,0.3)' }}>
            <Text style={{ color: '#FF5050', fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {/* Campo Username */}
        <Text className="text-white mb-2 ml-1" style={{ fontSize: 13 }}>Nombre de usuario</Text>
        <TextInput
          className="w-full py-4 px-4 rounded-xl"
          style={{ backgroundColor: '#12121A', borderWidth: 1, borderColor: fieldErrors.username ? '#FF5050' : '#2A2A3E', color: '#fff', fontSize: 15 }}
          placeholder="Tu nombre"
          placeholderTextColor="#444"
          value={username}
          onChangeText={(v) => { setUsername(v); setFieldErrors(p => ({ ...p, username: '' })); }}
          autoCapitalize="words"
        />
        {fieldErrors.username ? (
          <Text className="mt-1 mb-3 ml-1" style={{ color: '#FF5050', fontSize: 12 }}>{fieldErrors.username}</Text>
        ) : <View className="mb-4" />}

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
            placeholder="Mínimo 6 caracteres"
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
        {password.length > 0 && (() => {
          const strength = getPasswordStrength(password);
          return (
            <View className="mt-2 mb-1">
              <View className="w-full h-1 rounded-full" style={{ backgroundColor: '#2A2A3E' }}>
                <View className="h-1 rounded-full" style={{ width: strength?.width as any, backgroundColor: strength?.color }} />
              </View>
              <Text className="mt-1 ml-1" style={{ color: strength?.color, fontSize: 12 }}>{strength?.label}</Text>
            </View>
          );
        })()}
        {fieldErrors.password ? (
          <Text className="mt-1 mb-3 ml-1" style={{ color: '#FF5050', fontSize: 12 }}>{fieldErrors.password}</Text>
        ) : <View className="mb-4" />}

        {/* Confirmar Contraseña */}
        <Text className="text-white mb-2 ml-1" style={{ fontSize: 13 }}>Confirmar contraseña</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            className="w-full py-4 px-4 rounded-xl"
            style={{ backgroundColor: '#12121A', borderWidth: 1, borderColor: fieldErrors.confirmPassword ? '#FF5050' : '#2A2A3E', color: '#fff', fontSize: 15, paddingRight: 48 }}
            placeholder="Repite tu contraseña"
            placeholderTextColor="#444"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setFieldErrors(p => ({ ...p, confirmPassword: '' })); }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}
            onPress={() => setShowConfirmPassword(p => !p)}
            activeOpacity={0.7}
          >
            {showConfirmPassword
              ? <EyeOff size={20} color="#666" strokeWidth={1.5} />
              : <Eye size={20} color="#666" strokeWidth={1.5} />
            }
          </TouchableOpacity>
        </View>
        {fieldErrors.confirmPassword ? (
          <Text className="mt-1 mb-3 ml-1" style={{ color: '#FF5050', fontSize: 12 }}>{fieldErrors.confirmPassword}</Text>
        ) : <View className="mb-6" />}

        {/* Botón Crear cuenta */}
        <TouchableOpacity
          className="w-full py-4 rounded-xl items-center mb-4"
          style={{ backgroundColor: '#D4AF37', opacity: loading ? 0.7 : 1 }}
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#0A0A0F" />
            : <Text className="font-bold" style={{ color: '#0A0A0F', fontSize: 15 }}>Crear cuenta</Text>
          }
        </TouchableOpacity>

        {/* Ya tengo cuenta */}
        <View className="flex-row justify-center items-center mt-2">
          <Text style={{ color: '#666', fontSize: 14 }}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.replace('/login')} activeOpacity={0.7}>
            <Text style={{ color: '#D4AF37', fontSize: 14, fontWeight: '600' }}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
