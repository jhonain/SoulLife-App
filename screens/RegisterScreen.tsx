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
import { useAppTheme } from '../context/ThemeContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { loading, error, signUpWithEmail, signInWithGoogle, clearError, validateRegister } = useAuthViewModel();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const handleRegister = async () => {
    clearError();
    const { errors, hasErrors } = validateRegister(email, password, username, confirmPassword);
    setFieldErrors(errors);
    if (hasErrors) return;
    const result = await signUpWithEmail(email.trim(), password, username.trim());
    if (result) setSuccess(true);
  };

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return null;
    if (pass.length < 6) return { label: 'Muy débil', color: '#FF5050', width: '25%' };
    if (pass.length < 8) return { label: 'Débil', color: '#FF8C00', width: '50%' };
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass)) return { label: 'Fuerte', color: '#22C55E', width: '100%' };
    return { label: 'Media', color: colors.gold, width: '75%' };
  };

  if (success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, paddingHorizontal: 32 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 24, backgroundColor: colors.goldBg }}>
          <Heart size={32} color={colors.gold} fill={colors.gold} strokeWidth={1.5} />
        </View>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 24, textAlign: 'center', marginBottom: 12 }}>¡Cuenta creada!</Text>
        <Text style={{ color: colors.textMuted, textAlign: 'center', marginBottom: 32, lineHeight: 22 }}>
          Revisa tu correo para confirmar tu cuenta y luego inicia sesión.
        </Text>
        <TouchableOpacity
          style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', backgroundColor: colors.gold }}
          onPress={() => router.replace('/login' as any)}
          activeOpacity={0.8}
        >
          <Text style={{ fontWeight: 'bold', color: '#0A0A0F', fontSize: 15 }}>Ir a iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 26 }}>Únete a Soul-Life</Text>
          <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 8, textAlign: 'center' }}>Guarda tus frases favoritas y mucho más</Text>
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
          <Text style={{ color: colors.textMuted, fontSize: 13, marginHorizontal: 16 }}>o regístrate con email</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.borderStrong }} />
        </View>

        {/* Error global */}
        {error && (
          <View style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 16, backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.dangerBorder }}>
            <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {/* Username */}
        <Text style={{ color: colors.text, fontSize: 13, marginBottom: 8, marginLeft: 4 }}>Nombre de usuario</Text>
        <TextInput
          style={{ width: '100%', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: fieldErrors.username ? colors.danger : colors.borderStrong, color: colors.text, fontSize: 15 }}
          placeholder="Tu nombre"
          placeholderTextColor={colors.textSubtle}
          value={username}
          onChangeText={(v) => { setUsername(v); setFieldErrors(p => ({ ...p, username: '' })); }}
          autoCapitalize="words"
        />
        {fieldErrors.username
          ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4, marginBottom: 12, marginLeft: 4 }}>{fieldErrors.username}</Text>
          : <View style={{ marginBottom: 16 }} />
        }

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
            placeholder="Mínimo 6 caracteres"
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
            {showPassword ? <EyeOff size={20} color={colors.textMuted} strokeWidth={1.5} /> : <Eye size={20} color={colors.textMuted} strokeWidth={1.5} />}
          </TouchableOpacity>
        </View>
        {password.length > 0 && (() => {
          const strength = getPasswordStrength(password);
          return (
            <View style={{ marginTop: 8, marginBottom: 4 }}>
              <View style={{ width: '100%', height: 4, borderRadius: 2, backgroundColor: colors.borderStrong }}>
                <View style={{ height: 4, borderRadius: 2, width: strength?.width as any, backgroundColor: strength?.color }} />
              </View>
              <Text style={{ color: strength?.color, fontSize: 12, marginTop: 4, marginLeft: 4 }}>{strength?.label}</Text>
            </View>
          );
        })()}
        {fieldErrors.password
          ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4, marginBottom: 12, marginLeft: 4 }}>{fieldErrors.password}</Text>
          : <View style={{ marginBottom: 16 }} />
        }

        {/* Confirmar contraseña */}
        <Text style={{ color: colors.text, fontSize: 13, marginBottom: 8, marginLeft: 4 }}>Confirmar contraseña</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={{ width: '100%', paddingVertical: 16, paddingHorizontal: 16, paddingRight: 48, borderRadius: 12, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: fieldErrors.confirmPassword ? colors.danger : colors.borderStrong, color: colors.text, fontSize: 15 }}
            placeholder="Repite tu contraseña"
            placeholderTextColor={colors.textSubtle}
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setFieldErrors(p => ({ ...p, confirmPassword: '' })); }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}
            onPress={() => setShowConfirmPassword(p => !p)}
            activeOpacity={0.7}
          >
            {showConfirmPassword ? <EyeOff size={20} color={colors.textMuted} strokeWidth={1.5} /> : <Eye size={20} color={colors.textMuted} strokeWidth={1.5} />}
          </TouchableOpacity>
        </View>
        {fieldErrors.confirmPassword
          ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4, marginBottom: 12, marginLeft: 4 }}>{fieldErrors.confirmPassword}</Text>
          : <View style={{ marginBottom: 24 }} />
        }

        {/* Botón crear cuenta */}
        <TouchableOpacity
          style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16, backgroundColor: colors.gold, opacity: loading ? 0.7 : 1 }}
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#0A0A0F" />
            : <Text style={{ fontWeight: 'bold', color: '#0A0A0F', fontSize: 15 }}>Crear cuenta</Text>
          }
        </TouchableOpacity>

        {/* Ya tengo cuenta */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.replace('/login')} activeOpacity={0.7}>
            <Text style={{ color: colors.gold, fontSize: 14, fontWeight: '600' }}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
