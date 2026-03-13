import { View, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Frase } from '../../models/Frase';
import { FraseText } from './FraseText';
import { FraseActions } from './FraseActions';

interface Props {
  item: Frase;
  containerHeight: number;
  isSpeaking: boolean;
  isFavorite: boolean;
  viewShotRef: (ref: any) => void;
  onFavorite: () => void;
  onShare: () => void;
  onSpeak: () => void;
}

export function FraseCard({
  item,
  containerHeight,
  isSpeaking,
  isFavorite,
  viewShotRef,
  onFavorite,
  onShare,
  onSpeak,
}: Props) {
  return (
    <View
      style={{ height: containerHeight }}
      className="w-full relative justify-center items-center"
    >
      {/* Área capturada para compartir */}
      <ViewShot
        ref={viewShotRef}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        options={{ format: 'jpg', quality: 0.95 }}
      >
        {/* Imagen de fondo */}
        <Image
          source={{ uri: item.image_url }}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', position: 'absolute' }}
        />

        {/* Capa oscura */}
        <View className="absolute w-full h-full bg-black/60" />

        {/* Texto de la frase */}
        <FraseText item={item} />
      </ViewShot>

      {/* Botones (fuera del ViewShot, no se capturan) */}
      <FraseActions
        item={item}
        isSpeaking={isSpeaking}
        isFavorite={isFavorite}
        onFavorite={onFavorite}
        onShare={onShare}
        onSpeak={onSpeak}
      />
    </View>
  );
}
