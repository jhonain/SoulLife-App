import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Heart, X, UserPlus, LogIn } from 'lucide-react-native';
import { useAppTheme } from '../../context/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  onRegister: () => void;
  onLogin: () => void;
}

export function AuthPromptModal({ visible, onClose, onRegister, onLogin }: Props) {
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.overlay }}
        onPress={onClose}
      >
        <Pressable
          style={{
            width: '85%',
            borderRadius: 16,
            paddingHorizontal: 24,
            paddingVertical: 32,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.borderStrong,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <TouchableOpacity
            style={{ position: 'absolute', top: 16, right: 16 }}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Ícono */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.goldBg }}>
              <Heart size={32} color={colors.gold} strokeWidth={1.5} />
            </View>
          </View>

          {/* Título */}
          <Text style={{ color: colors.text, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, fontSize: 20 }}>
            Guarda tus favoritos
          </Text>

          {/* Descripción */}
          <Text style={{ color: colors.textMuted, textAlign: 'center', marginBottom: 32, fontSize: 14, lineHeight: 22 }}>
            Crea una cuenta gratis para guardar las frases que más te inspiran y acceder a ellas en cualquier momento.
          </Text>

          {/* Botón Registrarse */}
          <TouchableOpacity
            style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, backgroundColor: colors.gold }}
            activeOpacity={0.8}
            onPress={onRegister}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <UserPlus size={18} color="#0A0A0F" strokeWidth={2} />
              <Text style={{ fontWeight: 'bold', color: '#0A0A0F', fontSize: 15 }}>
                Crear cuenta gratis
              </Text>
            </View>
          </TouchableOpacity>

          {/* Botón Login */}
          <TouchableOpacity
            style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: colors.borderStrong }}
            activeOpacity={0.8}
            onPress={onLogin}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <LogIn size={18} color={colors.gold} strokeWidth={1.5} />
              <Text style={{ color: colors.gold, fontSize: 15 }}>Ya tengo cuenta</Text>
            </View>
          </TouchableOpacity>

          {/* Ahora no */}
          <TouchableOpacity style={{ width: '100%', paddingVertical: 8, alignItems: 'center' }} activeOpacity={0.7} onPress={onClose}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>Ahora no</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
