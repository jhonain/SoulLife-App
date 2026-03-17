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
import { useState } from 'react';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';
import { useAppTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { loading, error, signInWithEmail, signInWithGoogle, clearError, validateLogin } = useAuthViewModel();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    clearError();
    const { errors, hasErrors } = validateLogin(email, password);
    setFieldErrors(errors);
    if (hasErrors) return;
    const result = await signInWithEmail(email.trim(), password);
    if (result) router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16, backgroundColor: colors.goldBg }}>
            <Heart size={32} color={colors.gold} strokeWidth={1.5} />
          </View>
          <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 26 }}>Bienvenido de vuelta</Text>
          <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 8, textAlign: 'center' }}>Inicia sesión para ver tus favoritos</Text>
        </View>

        {/* Botón Google */}
        <TouchableOpacity
          style={{ width: '100%', paddingVertical: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, backgroundColor: colors.googleBtn, borderWidth: 1, borderColor: colors.borderStrong }}
          activeOpacity={0.8}
          onPress={signInWithGoogle}
          disabled={loading}
        >
          <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15, marginRight: 8 }}>G</Text>
          <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>Continuar con Google</Text>
        </TouchableOpacity>

        {/* Separador */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.borderStrong }} />
          <Text style={{ color: colors.textMuted, fontSize: 13, marginHorizontal: 16 }}>o inicia con email</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.borderStrong }} />
        </View>

        {/* Error global */}
        {error && (
          <View style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 16, backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.dangerBorder }}>
            <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {/* Email */}
        <Text style={{ color: colors.text, fontSize: 13, marginBottom: 8, marginLeft: 4 }}>Correo electrónico</Text>
        <TextInput
          style={{ width: '100%', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: fieldErrors.email ? colors.danger : colors.borderStrong, color: colors.text, fontSize: 15 }}
          placeholder="tu@correo.com"
          placeholderTextColor={colors.textSubtle}
          value={email}
          onChangeText={(v) => { setEmail(v); setFieldErrors(p => ({ ...p, email: '' })); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {fieldErrors.email
          ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4, marginBottom: 12, marginLeft: 4 }}>{fieldErrors.email}</Text>
          : <View style={{ marginBottom: 16 }} />
        }

        {/* Contraseña */}
        <Text style={{ color: colors.text, fontSize: 13, marginBottom: 8, marginLeft: 4 }}>Contraseña</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={{ width: '100%', paddingVertical: 16, paddingHorizontal: 16, paddingRight: 48, borderRadius: 12, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: fieldErrors.password ? colors.danger : colors.borderStrong, color: colors.text, fontSize: 15 }}
            placeholder="Tu contraseña"
            placeholderTextColor={colors.textSubtle}
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
              ? <EyeOff size={20} color={colors.textMuted} strokeWidth={1.5} />
              : <Eye size={20} color={colors.textMuted} strokeWidth={1.5} />
            }
          </TouchableOpacity>
        </View>
        {fieldErrors.password
          ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4, marginBottom: 8, marginLeft: 4 }}>{fieldErrors.password}</Text>
          : <View style={{ marginBottom: 8 }} />
        }

        {/* Olvidé contraseña */}
        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 24 }} activeOpacity={0.7}>
          <Text style={{ color: colors.gold, fontSize: 13 }}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Botón login */}
        <TouchableOpacity
          style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16, backgroundColor: colors.gold, opacity: loading ? 0.7 : 1 }}
          activeOpacity={0.8}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#0A0A0F" />
            : <Text style={{ fontWeight: 'bold', color: '#0A0A0F', fontSize: 15 }}>Iniciar sesión</Text>
          }
        </TouchableOpacity>

        {/* Crear cuenta */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
            <Text style={{ color: colors.gold, fontSize: 14, fontWeight: '600' }}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
