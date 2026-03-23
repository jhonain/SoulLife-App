import { View, Text } from 'react-native';

export default function ExploreScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-[#0A0A0F]">
      <Text className="text-2xl font-bold text-[#D4AF37] mb-2">
        Explorar
      </Text>
      <Text className="text-base text-[#666666]">
        Descubre nuevas funcionalidades aquí.
      </Text>
    </View>
  );
}