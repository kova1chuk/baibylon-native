import { BlurView } from 'expo-blur';

import { StyleSheet } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { useTheme } from '@/contexts/ThemeContext';

export default function BlurTabBarBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint={isDark ? 'dark' : 'light'}
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
