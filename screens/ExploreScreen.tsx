// ExploreScreen.tsx
// Pantalla de Explorar — estilo TikTok con búsqueda, categorías y grid
// [CREADO] - Grid de frases con búsqueda y filtro por categoría
// [MODIFICADO] - Fix categorías deformadas, quitado paddingTop duplicado

import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useExploreViewModel } from '../viewmodels/useExploreViewModel';
import { FraseExplore } from '../services/fraseService';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;

export default function ExploreScreen() {
  const { colors } = useAppTheme();
  const {
    frases,
    categorias,
    categoriaSeleccionada,
    searchQuery,
    loading,
    loadingMore,
    searching,
    handleCategoriaSelect,
    handleSearch,
    loadMore,
  } = useExploreViewModel();

  const renderCard = ({ item, index }: { item: FraseExplore; index: number }) => {
    const isOdd = index % 2 !== 0;
    const cardHeight = isOdd ? CARD_SIZE * 1.3 : CARD_SIZE * 1.1;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={{
          width: CARD_SIZE,
          height: cardHeight,
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        <ImageBackground
          source={{ uri: item.image_url }}
          style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
          imageStyle={{ borderRadius: 16 }}
        >
          {/* Gradiente oscuro */}
          <View style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }} />

          {/* Contenido */}
          <View style={{ padding: 10 }}>
            <View style={{
              backgroundColor: 'rgba(212,175,55,0.25)',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
              alignSelf: 'flex-start',
              marginBottom: 6,
            }}>
              <Text style={{ color: '#D4AF37', fontSize: 9, fontWeight: '700' }}>
                {item.categoria}
              </Text>
            </View>
            <Text
              style={{ color: '#fff', fontSize: 11, fontWeight: '600', lineHeight: 15 }}
              numberOfLines={3}
            >
              {item.texto}
            </Text>
            <Text
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 4, fontStyle: 'italic' }}
              numberOfLines={1}
            >
              — {item.autor}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    const leftCol: FraseExplore[] = [];
    const rightCol: FraseExplore[] = [];

    frases.forEach((item, index) => {
      if (index % 2 === 0) leftCol.push(item);
      else rightCol.push(item);
    });

    return (
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16 }}>
        <View style={{ flex: 1 }}>
          {leftCol.map((item, index) => renderCard({ item, index: index * 2 }))}
        </View>
        <View style={{ flex: 1 }}>
          {rightCol.map((item, index) => renderCard({ item, index: index * 2 + 1 }))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Barra de búsqueda */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          gap: 10,
        }}>
          {searching
            ? <ActivityIndicator size="small" color={colors.gold} />
            : <Search size={18} color={colors.textMuted} strokeWidth={1.5} />
          }
          <TextInput
            style={{ flex: 1, color: colors.text, fontSize: 15 }}
            placeholder="Buscar frases, autores..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} activeOpacity={0.7}>
              <X size={16} color={colors.textMuted} strokeWidth={1.5} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros de categoría — altura fija para evitar deformación */}
      <View style={{ height: 46, marginBottom: 4 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center', height: 46 }}
        >
          {/* Botón Todos */}
          <TouchableOpacity
            onPress={() => handleCategoriaSelect(null)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 8,
              backgroundColor: categoriaSeleccionada === null ? colors.gold : colors.card,
              borderWidth: 1,
              borderColor: categoriaSeleccionada === null ? colors.gold : colors.borderStrong,
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              color: categoriaSeleccionada === null ? '#0A0A0F' : colors.textMuted,
              fontSize: 13,
              fontWeight: categoriaSeleccionada === null ? '700' : '400',
            }}>
              🌟 Todos
            </Text>
          </TouchableOpacity>

          {/* Categorías */}
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => handleCategoriaSelect(cat.id)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 8,
                backgroundColor: categoriaSeleccionada === cat.id ? colors.gold : colors.card,
                borderWidth: 1,
                borderColor: categoriaSeleccionada === cat.id ? colors.gold : colors.borderStrong,
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                color: categoriaSeleccionada === cat.id ? '#0A0A0F' : colors.textMuted,
                fontSize: 13,
                fontWeight: categoriaSeleccionada === cat.id ? '700' : '400',
              }}>
                {cat.icon} {cat.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Contenido */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      ) : frases.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Text style={{ color: colors.textMuted, fontSize: 15, textAlign: 'center' }}>
            {searchQuery
              ? `No se encontraron frases para "${searchQuery}"`
              : 'No hay frases en esta categoría'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={[1]}
          keyExtractor={() => 'grid'}
          renderItem={() => renderGrid()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 40 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator size="small" color={colors.gold} style={{ padding: 16 }} />
              : null
          }
        />
      )}
    </View>
  );
}
