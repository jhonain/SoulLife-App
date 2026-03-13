import { View, ActivityIndicator, Text } from 'react-native';

interface Props {
  message?: string;
}

export function LoadingScreen({ message = 'CARGANDO...' }: Props) {
  return (
    <View className="flex-1 justify-center items-center bg-[#0A0A0F]">
      <ActivityIndicator size="large" color="#D4AF37" />
      <Text className="text-[#D4AF37] mt-4 font-bold text-lg tracking-widest">
        {message}
      </Text>
    </View>
  );
}
