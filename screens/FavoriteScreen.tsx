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

export default function FavoriteScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
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
            await Share.share({
                message: `"${item.texto}"\n\n— ${item.autor}\n\nDescubre más en Soul-Life app.`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const confirmRemove = (item: FraseFavorita) => {
        Alert.alert(
            'Eliminar favorito',
            '¿Deseas eliminar esta frase de tus favoritos?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => removeFavorite(item.id, item.frase_id),
                },
            ]
        );
    };

    // Usuario no logueado
    if (!isLoggedIn && !loading) {
        return (
            <View
                className="flex-1 bg-[#0A0A0F] justify-center items-center px-8"
                style={{ paddingTop: insets.top }}
            >
                <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-6"
                    style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                >
                    <Heart size={40} color="#D4AF37" strokeWidth={1.5} />
                </View>
                <Text className="text-white font-bold text-xl text-center mb-2">
                    Guarda tus favoritos
                </Text>
                <Text className="text-center mb-8" style={{ color: '#666', lineHeight: 22, fontSize: 14 }}>
                    Inicia sesión para ver y guardar tus frases favoritas.
                </Text>
                <TouchableOpacity
                    className="w-full py-4 rounded-xl items-center mb-3 flex-row justify-center gap-2"
                    style={{ backgroundColor: '#D4AF37' }}
                    activeOpacity={0.8}
                    onPress={() => router.push('/screens/LoginScreen' as any)}
                >
                    <LogIn size={18} color="#0A0A0F" strokeWidth={2} />
                    <Text className="font-bold" style={{ color: '#0A0A0F', fontSize: 15 }}>
                        Iniciar sesión
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="w-full py-4 rounded-xl items-center flex-row justify-center gap-2"
                    style={{ borderWidth: 1, borderColor: '#2A2A3E' }}
                    activeOpacity={0.8}
                    onPress={() => router.push('/screens/RegisterScreen' as any)}
                >
                    <UserPlus size={18} color="#D4AF37" strokeWidth={1.5} />
                    <Text style={{ color: '#D4AF37', fontSize: 15 }}>Crear cuenta gratis</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#0A0A0F]">
                <ActivityIndicator size="large" color="#D4AF37" />
            </View>
        );
    }

    const renderItem = ({ item }: { item: FraseFavorita }) => (
        <View
            className="mx-4 mb-4 rounded-2xl p-4"
            style={{ backgroundColor: '#12121A', borderWidth: 1, borderColor: '#1A1A2E' }}
        >
            {/* Categoría badge */}
            <View className="flex-row items-center mb-3">
                <View
                    className="flex-row items-center gap-1"
                    style={{
                        backgroundColor: 'rgba(212,175,55,0.15)',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                        alignSelf: 'flex-start',
                    }}
                >
                    <Tag size={11} color="#D4AF37" strokeWidth={1.5} />
                    <Text style={{ color: '#D4AF37', fontSize: 11, fontWeight: '600', marginLeft: 4 }}>
                        {item.categoria}
                    </Text>
                </View>
            </View>

            {/* Ícono de cita */}
            <Quote size={20} color="#D4AF37" style={{ opacity: 0.6, marginBottom: 8 }} />

            {/* Texto */}
            <Text
                className="text-white font-bold mb-3"
                style={{ fontSize: 16, lineHeight: 24 }}
            >
                {item.texto}
            </Text>

            {/* Autor */}
            <Text
                className="italic mb-4"
                style={{ color: '#D4AF37', fontSize: 13 }}
            >
                — {item.autor}
            </Text>

            {/* Botones */}
            <View
                className="flex-row pt-3"
                style={{ borderTopWidth: 1, borderTopColor: '#2A2A3E' }}
            >
                <TouchableOpacity
                    className="flex-1 py-2 items-center justify-center flex-row gap-2"
                    style={{ backgroundColor: '#1A1A2E', borderRadius: 10 }}
                    activeOpacity={0.7}
                    onPress={() => handleShare(item)}
                >
                    <Share2 size={16} color="#fff" strokeWidth={1.5} />
                    <Text className="text-white" style={{ fontSize: 13 }}>Compartir</Text>
                </TouchableOpacity>

                <View className="w-3" />

                <TouchableOpacity
                    className="flex-1 py-2 items-center justify-center flex-row gap-2"
                    style={{
                        backgroundColor: 'rgba(255,80,80,0.1)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,80,80,0.2)',
                        borderRadius: 10,
                    }}
                    activeOpacity={0.7}
                    onPress={() => confirmRemove(item)}
                >
                    <Trash2 size={16} color="#FF5050" strokeWidth={1.5} />
                    <Text style={{ color: '#FF5050', fontSize: 13 }}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-[#0A0A0F]" style={{ paddingTop: insets.top }}>

            {/* Header */}
            <View className="px-4 pt-4 pb-2">
                <Text className="text-white font-bold" style={{ fontSize: 26 }}>Mis Favoritos</Text>
                <Text style={{ color: '#666', fontSize: 13, marginTop: 2 }}>
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
                                    backgroundColor: categoriaSeleccionada === cat ? '#D4AF37' : '#1A1A2E',
                                    borderWidth: 1,
                                    borderColor: categoriaSeleccionada === cat ? '#D4AF37' : '#2A2A3E',
                                }}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={{
                                        color: categoriaSeleccionada === cat ? '#0A0A0F' : '#888',
                                        fontSize: 13,
                                        fontWeight: categoriaSeleccionada === cat ? '700' : '400',
                                    }}
                                >
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
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor="#D4AF37"
                            colors={['#D4AF37']}
                        />
                    }
                >
                    <Heart size={48} color="#2A2A3E" strokeWidth={1.5} />
                    <Text className="text-center mt-4" style={{ color: '#444', fontSize: 15 }}>
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
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor="#D4AF37"
                            colors={['#D4AF37']}
                        />
                    }
                />
            )}
        </View>
    );
}
