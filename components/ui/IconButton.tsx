import { TouchableOpacity, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface Props {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  color?: string;
  size?: number;
  filled?: boolean;
}

export function IconButton({ icon: Icon, label, onPress, color = '#FFFFFF', size = 32, filled = false }: Props) {
  return (
    <TouchableOpacity className="items-center" activeOpacity={0.7} onPress={onPress}>
      <Icon
        size={size}
        color={color}
        strokeWidth={1.5}
        fill={filled ? color : 'none'}
      />
      <Text
        className="text-[10px] mt-2 tracking-wider"
        style={{ color }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
