import React, { useCallback } from 'react';

import { RefreshCw } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View, Text, ScrollView, Pressable } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { dictionaryApi } from '@/entities/dictionary/api/dictionaryApi';
import { dashboardApi } from '@/features/hub/api/dashboardApi';
import { useAppDispatch } from '@/shared/model/store';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

import {
  DashboardHero,
  DashboardMetrics,
  DashboardDonutChart,
  QuickActions,
  WordOfTheMoment,
  ActivityHeatmap,
  EnglishSkillsChart,
} from './dashboard';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const dispatch = useAppDispatch();

  const handleRefresh = useCallback(() => {
    dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
    dispatch(dictionaryApi.util.invalidateTags(['DictionaryStats']));
  }, [dispatch]);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: tabBarHeight + 20,
        flexGrow: 1,
      }}
    >
      <View
        className="flex-row items-center justify-between px-4 pb-2"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('dashboard.title')}
        </Text>
        <Pressable onPress={handleRefresh} className="p-2 active:opacity-50">
          <RefreshCw size={20} color={isDark ? '#FAFAF9' : '#111827'} />
        </Pressable>
      </View>

      <View className="gap-4 pt-2 pb-4">
        <DashboardHero />
        <DashboardMetrics />
        <DashboardDonutChart />
        <QuickActions />
        <WordOfTheMoment />
        <ActivityHeatmap />
        <EnglishSkillsChart />
      </View>
    </ScrollView>
  );
}
