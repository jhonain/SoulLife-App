import { View, ActivityIndicator, Text } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

interface Props {
  message?: string;
}

export function LoadingScreen({ message = 'CARGANDO...' }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.gold} />
      <Text style={{ color: colors.gold, marginTop: 16, fontWeight: 'bold', fontSize: 18, letterSpacing: 4 }}>
        {message}
      </Text>
    </View>
  );
}
