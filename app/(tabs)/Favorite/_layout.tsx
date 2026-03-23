// (tabs)/favorite/_layout.tsx
import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../context/ThemeContext';
import { useFavoritesContext } from '../../../context/FavoritesContext';

export default function FavoriteLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { favorites } = useFavoritesContext();
  const total = favorites.size;

  return (
    <>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: insets.top + 16, paddingBottom: 8, backgroundColor: colors.background }}>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 26 }}>Mis Favoritos</Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
          {total} {total === 1 ? 'guardado' : 'guardados'}
        </Text>
      </View>

      {/* Pantalla hija */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}