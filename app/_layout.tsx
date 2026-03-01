import '../global.css';
import '@/i18n';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import {
  ThemeProvider as AppThemeProvider,
  useTheme,
} from '@/contexts/ThemeContext';
import { store } from '@/shared/model/store';

const LightNavTheme = {
  dark: false,
  colors: {
    primary: '#10B981',
    background: '#FAF9F6',
    card: '#FFFFFF',
    text: '#111827',
    border: '#E7E5E4',
    notification: '#EF4444',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '800' as const },
  },
};

const DarkNavTheme = {
  dark: true,
  colors: {
    primary: '#6EE7B7',
    background: '#0A0A0F',
    card: '#111113',
    text: '#FAFAF9',
    border: '#27272A',
    notification: '#EF4444',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '800' as const },
  },
};

function AppContent() {
  const { theme } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={theme === 'dark' ? DarkNavTheme : LightNavTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <AppContent />
      </AppThemeProvider>
    </Provider>
  );
}
