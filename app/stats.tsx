import React from 'react';

import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/contexts/ThemeContext';
import { StatsScreen } from '@/features/stats';

export default function Stats() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <Stack.Screen
        options={{
          title: t('nav.stats'),
          headerStyle: {
            backgroundColor: isDark ? '#0A0A0F' : '#FAF9F6',
          },
          headerTintColor: isDark ? '#FAFAF9' : '#111827',
          headerShadowVisible: false,
        }}
      />
      <StatsScreen />
    </>
  );
}
