import React from 'react';

import { RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View, Text, ScrollView, Pressable } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

import {
  DashboardHero,
  DashboardMetrics,
  DashboardDonutChart,
  QuickActions,
  StreakTracker,
  WordOfTheMoment,
  ActivityHeatmap,
  EnglishSkillsChart,
} from './dashboard';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: tabBarHeight + 20,
        flexGrow: 1,
      }}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-2"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Dashboard
        </Text>
        <Pressable
          onPress={handleRefresh}
          disabled={refreshing}
          className="p-2 active:opacity-50"
          style={{ opacity: refreshing ? 0.5 : 1 }}
        >
          <RefreshCw size={20} color={isDark ? '#FAFAF9' : '#111827'} />
        </Pressable>
      </View>

      <View className="gap-4 pt-2 pb-4">
        <DashboardHero />
        <DashboardMetrics />
        <DashboardDonutChart />
        <QuickActions />
        <StreakTracker />
        <WordOfTheMoment />
        <ActivityHeatmap />
        <EnglishSkillsChart />
      </View>
    </ScrollView>
  );
}
