import { View, Text } from 'react-native';

interface Props {
  message?: string;
}

export function EmptyState({ message = 'No hay contenido disponible.' }: Props) {
  return (
    <View className="flex-1 justify-center items-center bg-[#0A0A0F] px-6">
      <Text className="text-[#666] text-xl font-bold text-center">
        {message}
      </Text>
    </View>
  );
}
