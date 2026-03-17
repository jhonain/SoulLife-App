import { View, Text } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

interface Props {
  message?: string;
}

export function EmptyState({ message = 'No hay contenido disponible.' }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, paddingHorizontal: 24 }}>
      <Text style={{ color: colors.textMuted, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
        {message}
      </Text>
    </View>
  );
}
