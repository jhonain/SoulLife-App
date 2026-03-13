import { Tabs } from 'expo-router';
import { Heart, Home, Compass, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  // Si insets.bottom > 0, el celular usa gestos (sin botones físicos)
  // Si insets.bottom === 0, tiene botones físicos
  const hasGestureNav = insets.bottom > 0;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#666666',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0A0A0F',
          borderTopColor: '#1A1A2E',
          height: hasGestureNav ? 70 + insets.bottom : 70,
          paddingBottom: hasGestureNav ? insets.bottom : 15,
          paddingTop: 15,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}