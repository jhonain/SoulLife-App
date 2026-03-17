import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Share2, Trash2, LogIn, UserPlus, Quote, Tag } from 'lucide-react-native';
import { useFavoritesViewModel, FraseFavorita } from '../viewmodels/useFavoritesViewModel';
import { useAppTheme } from '../context/ThemeContext';

export default function FavoriteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const {
    favorites,
    totalFavorites,
    loading,
    refreshing,
    isLoggedIn,
    categorias,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    removeFavorite,
    handleRefresh,
  } = useFavoritesViewModel();

  const handleShare = async (item: FraseFavorita) => {
    try {
      await Share.share({ message: `"${item.texto}"\n\n— ${item.autor}\n\nDescubre más en Soul-Life app.` });
    } catch (error) { console.error(error); }
  };

  const confirmRemove = (item: FraseFavorita) => {
    Alert.alert(
      'Eliminar favorito',
      '¿Deseas eliminar esta frase de tus favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeFavorite(item.id, item.frase_id) },
      ]
    );
  };

  if (!isLoggedIn && !loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingTop: insets.top }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24, backgroundColor: colors.goldBgLight }}>
          <Heart size={40} color={colors.gold} strokeWidth={1.5} />
        </View>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginBottom: 8 }}>Guarda tus favoritos</Text>
        <Text style={{ color: colors.textMuted, textAlign: 'center', marginBottom: 32, lineHeight: 22, fontSize: 14 }}>
          Inicia sesión para ver y guardar tus frases favoritas.
        </Text>
        <TouchableOpacity
          style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: colors.gold }}
          activeOpacity={0.8}
          onPress={() => router.push('/login' as any)}
        >
          <LogIn size={18} color="#0A0A0F" strokeWidth={2} />
          <Text style={{ fontWeight: 'bold', color: '#0A0A0F', fontSize: 15 }}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.borderStrong }}
          activeOpacity={0.8}
          onPress={() => router.push('/register' as any)}
        >
          <UserPlus size={18} color={colors.gold} strokeWidth={1.5} />
          <Text style={{ color: colors.gold, fontSize: 15 }}>Crear cuenta gratis</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: FraseFavorita }) => (
    <View style={{ marginHorizontal: 16, marginBottom: 16, borderRadius: 16, padding: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
      {/* Categoría badge */}
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.goldBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', gap: 4 }}>
          <Tag size={11} color={colors.gold} strokeWidth={1.5} />
          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '600', marginLeft: 4 }}>{item.categoria}</Text>
        </View>
      </View>

      <Quote size={20} color={colors.gold} style={{ opacity: 0.6, marginBottom: 8 }} />

      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16, lineHeight: 24, marginBottom: 12 }}>{item.texto}</Text>

      <Text style={{ color: colors.gold, fontStyle: 'italic', fontSize: 13, marginBottom: 16 }}>— {item.autor}</Text>

      <View style={{ flexDirection: 'row', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.borderStrong }}>
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, backgroundColor: colors.border, borderRadius: 10 }}
          activeOpacity={0.7}
          onPress={() => handleShare(item)}
        >
          <Share2 size={16} color={colors.text} strokeWidth={1.5} />
          <Text style={{ color: colors.text, fontSize: 13 }}>Compartir</Text>
        </TouchableOpacity>
        <View style={{ width: 12 }} />
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: 10 }}
          activeOpacity={0.7}
          onPress={() => confirmRemove(item)}
        >
          <Trash2 size={16} color={colors.danger} strokeWidth={1.5} />
          <Text style={{ color: colors.danger, fontSize: 13 }}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 26 }}>Mis Favoritos</Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
          {totalFavorites} {totalFavorites === 1 ? 'guardado' : 'guardados'}
        </Text>
      </View>

      {/* Filtros de categoría */}
      {categorias.length > 1 && (
        <View style={{ height: 44, marginBottom: 4 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center', height: 44 }}
          >
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategoriaSeleccionada(cat)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 8,
                  backgroundColor: categoriaSeleccionada === cat ? colors.gold : colors.card,
                  borderWidth: 1,
                  borderColor: categoriaSeleccionada === cat ? colors.gold : colors.borderStrong,
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: categoriaSeleccionada === cat ? '#0A0A0F' : colors.textMuted, fontSize: 13, fontWeight: categoriaSeleccionada === cat ? '700' : '400' }}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Lista vacía */}
      {favorites.length === 0 ? (
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.gold} colors={[colors.gold]} />}
        >
          <Heart size={48} color={colors.borderStrong} strokeWidth={1.5} />
          <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 16, fontSize: 15 }}>
            {categoriaSeleccionada === 'Todos'
              ? 'Aún no tienes favoritos.\nDesliza y guarda las frases que te inspiren.'
              : `No tienes favoritos en "${categoriaSeleccionada}".`}
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 4 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.gold} colors={[colors.gold]} />}
        />
      )}
    </View>
  );
}
