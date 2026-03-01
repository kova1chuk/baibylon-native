import React from 'react';

import { Stack } from 'expo-router';

import { useTheme } from '@/contexts/ThemeContext';
import { LegalWebViewScreen } from '@/features/legal';

export default function Terms() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Terms of Service',
          headerStyle: {
            backgroundColor: isDark ? '#0A0A0F' : '#FAF9F6',
          },
          headerTintColor: isDark ? '#FAFAF9' : '#111827',
          headerShadowVisible: false,
        }}
      />
      <LegalWebViewScreen path="/terms" />
    </>
  );
}
