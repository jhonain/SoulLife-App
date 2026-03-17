import { Platform } from 'react-native';

export const AppColors = {
  dark: {
    background: '#0A0A0F',
    card: '#12121A',
    border: '#1A1A2E',
    borderStrong: '#2A2A3E',
    text: '#FFFFFF',
    textMuted: '#666666',
    textSubtle: '#444444',
    gold: '#D4AF37',
    goldBg: 'rgba(212,175,55,0.15)',
    goldBgLight: 'rgba(212,175,55,0.1)',
    inputBg: '#12121A',
    tabBg: '#0A0A0F',
    danger: '#FF5050',
    dangerBg: 'rgba(255,80,80,0.1)',
    dangerBorder: 'rgba(255,80,80,0.2)',
    separatorBg: '#1A1A2E',
    overlay: 'rgba(0,0,0,0.75)',
    googleBtn: '#1A1A2E',
  },
  light: {
    background: '#F5F5F0',
    card: '#FFFFFF',
    border: '#E5E5E0',
    borderStrong: '#D0D0CC',
    text: '#0A0A0F',
    textMuted: '#888888',
    textSubtle: '#AAAAAA',
    gold: '#B8960C',
    goldBg: 'rgba(184,150,12,0.15)',
    goldBgLight: 'rgba(184,150,12,0.1)',
    inputBg: '#EBEBEB',
    tabBg: '#FFFFFF',
    danger: '#FF5050',
    dangerBg: 'rgba(255,80,80,0.1)',
    dangerBorder: 'rgba(255,80,80,0.2)',
    separatorBg: '#E5E5E0',
    overlay: 'rgba(0,0,0,0.6)',
    googleBtn: '#EBEBEB',
  },
};

export type AppColorScheme = typeof AppColors.dark;

// Colores legacy para compatibilidad con hooks existentes
export const Colors = {
  light: {
    text: '#0A0A0F',
    background: '#F5F5F0',
    tint: '#B8960C',
    icon: '#888888',
    tabIconDefault: '#888888',
    tabIconSelected: '#B8960C',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0A0A0F',
    tint: '#D4AF37',
    icon: '#666666',
    tabIconDefault: '#666666',
    tabIconSelected: '#D4AF37',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
