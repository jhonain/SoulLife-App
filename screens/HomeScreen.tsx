import { View, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useHomeViewModel } from '../viewmodels/useHomeViewModel';
import { FraseCard } from '../components/frases/FraseCard';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { EmptyState } from '../components/ui/EmptyState';
import { AuthPromptModal } from '../components/ui/AuthPromptModal';

export default function HomeScreen() {
  const [containerHeight, setContainerHeight] = useState(Dimensions.get('window').height);
  const router = useRouter();
  const vm = useHomeViewModel();

  if (vm.loading) return <LoadingScreen />;
  if (vm.frases.length === 0) return <EmptyState message="No hay frases activas disponibles." />;

  return (
    <View
      className="flex-1 bg-black"
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      <FlatList
        data={vm.frases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FraseCard
            item={item}
            containerHeight={containerHeight}
            isSpeaking={vm.speakingId === item.id}
            isFavorite={vm.favorites.has(item.id)}
            viewShotRef={(ref) => { vm.viewShotRefs.current[item.id] = ref; }}
            onShare={() => vm.handleShare(item)}
            onSpeak={() => vm.handleSpeak(item)}
            onFavorite={() => vm.handleFavorite(item)}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        onViewableItemsChanged={vm.handleScrollChange}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onEndReached={() => vm.loadMore()}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          vm.loadingMore
            ? <ActivityIndicator size="small" color="#D4AF37" style={{ padding: 16 }} />
            : null
        }
      />

      {/* Modal de autenticación */}
      <AuthPromptModal
        visible={vm.showAuthModal}
        onClose={() => vm.setShowAuthModal(false)}
        onRegister={() => {
          vm.setShowAuthModal(false);
          router.push('/register');
        }}
        onLogin={() => {
          vm.setShowAuthModal(false);
          router.push('/login');
        }}
      />
    </View>
  );
}
