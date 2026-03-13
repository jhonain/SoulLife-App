import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Heart, X, UserPlus, LogIn } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onRegister: () => void;
  onLogin: () => void;
}

export function AuthPromptModal({ visible, onClose, onRegister, onLogin }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Fondo oscuro */}
      <Pressable
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        onPress={onClose}
      >
        {/* Tarjeta del modal */}
        <Pressable
          className="w-[85%] rounded-2xl px-6 py-8"
          style={{ backgroundColor: '#12121A', borderWidth: 1, borderColor: '#2A2A3E' }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <TouchableOpacity
            className="absolute top-4 right-4"
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={20} color="#666" />
          </TouchableOpacity>

          {/* Ícono */}
          <View className="items-center mb-5">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(212,175,55,0.15)' }}
            >
              <Heart size={32} color="#D4AF37" strokeWidth={1.5} />
            </View>
          </View>

          {/* Título */}
          <Text
            className="text-white font-bold text-center mb-2"
            style={{ fontSize: 20 }}
          >
            Guarda tus favoritos
          </Text>

          {/* Descripción */}
          <Text
            className="text-center mb-8"
            style={{ color: '#888', fontSize: 14, lineHeight: 22 }}
          >
            Crea una cuenta gratis para guardar las frases que más te inspiran y acceder a ellas en cualquier momento.
          </Text>

          {/* Botón Registrarse */}
          <TouchableOpacity
            className="w-full py-4 rounded-xl items-center mb-3"
            style={{ backgroundColor: '#D4AF37' }}
            activeOpacity={0.8}
            onPress={onRegister}
          >
            <View className="flex-row items-center gap-2">
              <UserPlus size={18} color="#0A0A0F" strokeWidth={2} />
              <Text className="font-bold" style={{ color: '#0A0A0F', fontSize: 15 }}>
                Crear cuenta gratis
              </Text>
            </View>
          </TouchableOpacity>

          {/* Botón Login */}
          <TouchableOpacity
            className="w-full py-4 rounded-xl items-center mb-3"
            style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2A2A3E' }}
            activeOpacity={0.8}
            onPress={onLogin}
          >
            <View className="flex-row items-center gap-2">
              <LogIn size={18} color="#D4AF37" strokeWidth={1.5} />
              <Text style={{ color: '#D4AF37', fontSize: 15 }}>
                Ya tengo cuenta
              </Text>
            </View>
          </TouchableOpacity>

          {/* Ahora no */}
          <TouchableOpacity
            className="w-full py-2 items-center"
            activeOpacity={0.7}
            onPress={onClose}
          >
            <Text style={{ color: '#555', fontSize: 13 }}>Ahora no</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
