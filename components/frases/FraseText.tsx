import { View, Text } from 'react-native';
import { Quote } from 'lucide-react-native';
import { Frase } from '../../models/Frase';

interface Props {
  item: Frase;
}

export function FraseText({ item }: Props) {
  return (
    <View className="flex-1 w-full justify-center px-6 mt-16">
      <Quote size={40} color="#D4AF37" style={{ marginBottom: 24, opacity: 0.8 }} />

      <Text
        className="text-white font-bold leading-tight"
        style={{
          fontSize: 28,
          textShadowColor: 'rgba(0,0,0,0.95)',
          textShadowOffset: { width: 1, height: 2 },
          textShadowRadius: 10,
        }}
      >
        {item.texto}
      </Text>

      <Text
        className="text-[#D4AF37] font-medium text-xl mt-8 italic"
        style={{
          textShadowColor: 'rgba(0,0,0,0.95)',
          textShadowOffset: { width: 1, height: 2 },
          textShadowRadius: 10,
        }}
      >
        — {item.autor}
      </Text>

      {/* Watermark */}
      <Text className="text-white/40 text-xs mt-12 tracking-widest uppercase text-center">
        Soul-Life App
      </Text>
    </View>
  );
}
