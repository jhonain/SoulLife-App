import { View } from 'react-native';
import { Heart, Share2, Volume2, VolumeX } from 'lucide-react-native';
import { IconButton } from '../ui/IconButton';
import { Frase } from '../../models/Frase';

interface Props {
  item: Frase;
  isSpeaking: boolean;
  isFavorite: boolean;
  onFavorite: () => void;
  onShare: () => void;
  onSpeak: () => void;
}

export function FraseActions({ isSpeaking, isFavorite, onFavorite, onShare, onSpeak }: Props) {
  return (
    <View className="absolute bottom-16 w-full flex-row justify-around items-center px-4">
      <IconButton
        icon={Heart}
        label={isFavorite ? 'Guardado' : 'Favorito'}
        onPress={onFavorite}
        color={isFavorite ? '#FF4444' : '#FFFFFF'}
        filled={true}
      />
      <IconButton
        icon={Share2}
        label="Compartir"
        onPress={onShare}
      />
      <IconButton
        icon={isSpeaking ? VolumeX : Volume2}
        label={isSpeaking ? 'Detener' : 'Escuchar'}
        onPress={onSpeak}
        color={isSpeaking ? '#D4AF37' : '#FFFFFF'}
      />
    </View>
  );
}
