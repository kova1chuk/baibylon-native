import React, { useCallback, useState } from 'react';

import { RefreshCw } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View, Text, ScrollView, Pressable } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import {
  dictionaryApi,
  useGetDictStatsQuery,
  useGetRandomWordQuery,
} from '@/entities/dictionary/api/dictionaryApi';
import {
  dashboardApi,
  useGetDashboardHomeQuery,
  useGetDashboardSummaryQuery,
  useGetActivityHeatmapQuery,
} from '@/features/hub/api/dashboardApi';
import { useAppDispatch } from '@/shared/model/store';

import {
  DashboardHero,
  DashboardMetrics,
  DashboardDonutChart,
  WordOfTheMoment,
  ActivityHeatmap,
  EnglishSkillsChart,
} from './dashboard';
import { HEATMAP_WEEKS } from './dashboard/ActivityHeatmap';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const dispatch = useAppDispatch();

  // Lift all RTK Query calls here to avoid navigation context crash in child components
  const { data: dictStats } = useGetDictStatsQuery({ langCode: 'en' });
  const { data: summaryData } = useGetDashboardSummaryQuery();
  const { data: dashboardHome } = useGetDashboardHomeQuery();
  const { data: activityData } = useGetActivityHeatmapQuery({
    weeks: HEATMAP_WEEKS,
  });

  const [wordTimestamp, setWordTimestamp] = useState(() => Date.now());
  const { data: randomWord } = useGetRandomWordQuery({
    langCode: 'en',
    translationLang: 'uk',
    _timestamp: wordTimestamp,
  });

  const handleRefresh = useCallback(() => {
    dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
    dispatch(dictionaryApi.util.invalidateTags(['DictionaryStats']));
  }, [dispatch]);

  const handleRefreshWord = useCallback(() => {
    setWordTimestamp(Date.now());
  }, []);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: 100,
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
        <DashboardMetrics data={summaryData} />
        <DashboardDonutChart statsData={dictStats} />
        <WordOfTheMoment word={randomWord} onRefresh={handleRefreshWord} />
        <ActivityHeatmap activityData={activityData} />
        <EnglishSkillsChart data={dashboardHome} />
      </View>
    </ScrollView>
  );
}
