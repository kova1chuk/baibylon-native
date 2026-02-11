import { View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export default function TabBarBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      }}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
