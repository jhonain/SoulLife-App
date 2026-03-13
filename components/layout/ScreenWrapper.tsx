import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ScreenWrapper({ children, className }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`flex-1 bg-[#0A0A0F] ${className ?? ''}`}
      style={{ paddingTop: insets.top }}
    >
      {children}
    </View>
  );
}
