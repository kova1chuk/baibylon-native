import React from 'react';

import {
  BarChart3,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import {
  useGetStreakInfoQuery,
  useGetLearningStatisticsQuery,
} from '@/entities/learning-queue/api/multiSessionApi';
import { useGetActivityHeatmapQuery } from '@/features/hub/api/dashboardApi';

import { useColors } from '@/hooks/useColors';

import ActivityHeatmapSection from './ActivityHeatmapSection';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  isDark: boolean;
}

function StatCard({ icon, label, value, sub, color, isDark }: StatCardProps) {
  return (
    <View
      className="rounded-xl p-4 flex-1"
      style={{
        backgroundColor: isDark ? '#111113' : '#FFFFFF',
        borderWidth: 1,
        borderColor: isDark ? '#27272A' : '#E7E5E4',
        minWidth: '47%',
      }}
    >
      <View className="flex-row items-center gap-2 mb-3">
        <View
          className="w-8 h-8 rounded-lg items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          {icon}
        </View>
        <Text className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {label}
        </Text>
      </View>
      <Text className="text-2xl font-bold text-foreground">{value}</Text>
      {sub ? (
        <Text className="text-xs text-muted-foreground mt-0.5">{sub}</Text>
      ) : null}
    </View>
  );
}

function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours.toFixed(1)}h`;
}

export default function StatsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = useColors();

  const { data: streak, isLoading: loadingStreak } = useGetStreakInfoQuery();
  const { data: stats, isLoading: loadingStats } =
    useGetLearningStatisticsQuery();
  const { data: heatmapData } = useGetActivityHeatmapQuery({ weeks: 12 });

  const isLoading = loadingStreak || loadingStats;

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="flex-row items-center gap-2 mb-5">
        <BarChart3 size={20} color="#6EE7B7" />
        <Text className="text-xl font-bold text-foreground">
          {t('nav.stats')}
        </Text>
      </View>

      {/* Streak Banner */}
      {streak && (streak.currentStreak > 0 || streak.longestStreak > 0) && (
        <View
          className="rounded-2xl p-4 mb-5"
          style={{
            backgroundColor: isDark
              ? 'rgba(129,140,248,0.06)'
              : 'rgba(129,140,248,0.04)',
            borderWidth: 1,
            borderColor: isDark
              ? 'rgba(129,140,248,0.15)'
              : 'rgba(129,140,248,0.1)',
          }}
        >
          <View className="flex-row items-center justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold" style={{ color: '#818CF8' }}>
                {streak.currentStreak}
              </Text>
              <Text className="text-xs text-muted-foreground mt-0.5">
                Current Streak
              </Text>
            </View>
            <View
              style={{
                width: 1,
                height: 36,
                backgroundColor: isDark ? '#27272A' : '#E7E5E4',
              }}
            />
            <View className="items-center">
              <Text className="text-3xl font-bold" style={{ color: '#F59E0B' }}>
                {streak.longestStreak}
              </Text>
              <Text className="text-xs text-muted-foreground mt-0.5">
                Longest Streak
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="flex-row flex-wrap gap-3 mb-5">
        <StatCard
          icon={<BookOpen size={16} color="#F59E0B" />}
          label="Total Exercises"
          value={stats?.totalItemsCompleted ?? 0}
          sub={`${streak?.exercisesThisMonth ?? 0} this month`}
          color="#F59E0B"
          isDark={isDark}
        />
        <StatCard
          icon={<Trophy size={16} color="#6EE7B7" />}
          label="Total Sessions"
          value={stats?.totalSessions ?? 0}
          sub={`${stats?.totalItemsCompleted ?? 0} exercises`}
          color="#6EE7B7"
          isDark={isDark}
        />
        <StatCard
          icon={<Clock size={16} color="#818CF8" />}
          label="Time Spent"
          value={formatHours(stats?.totalTimeSpentHours ?? 0)}
          sub={`Avg ${stats?.avgSessionDurationMinutes?.toFixed(0) ?? 0}m/session`}
          color="#818CF8"
          isDark={isDark}
        />
        <StatCard
          icon={<Target size={16} color="#F472B6" />}
          label="Success Rate"
          value={`${Math.round(stats?.avgSuccessRate ?? 0)}%`}
          color="#F472B6"
          isDark={isDark}
        />
        <StatCard
          icon={<Zap size={16} color="#FB923C" />}
          label="This Week"
          value={streak?.exercisesThisWeek ?? 0}
          sub={`${streak?.sessionsThisWeek ?? 0} sessions`}
          color="#FB923C"
          isDark={isDark}
        />
        <StatCard
          icon={<TrendingUp size={16} color="#22D3EE" />}
          label="This Month"
          value={streak?.exercisesThisMonth ?? 0}
          sub={`${streak?.sessionsThisMonth ?? 0} sessions`}
          color="#22D3EE"
          isDark={isDark}
        />
      </View>

      {heatmapData && heatmapData.length > 0 && (
        <ActivityHeatmapSection data={heatmapData} isDark={isDark} />
      )}

      {stats?.typeDistributionSummary && (
        <View
          className="rounded-xl p-4 mt-5"
          style={{
            backgroundColor: isDark ? '#111113' : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDark ? '#27272A' : '#E7E5E4',
          }}
        >
          <Text className="text-base font-semibold text-foreground mb-3">
            Exercise Distribution
          </Text>
          {Object.entries(stats.typeDistributionSummary).map(
            ([type, count]) => {
              const total = Object.values(
                stats.typeDistributionSummary!
              ).reduce((sum, c) => sum + c, 0);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <View key={type} className="mb-2.5">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm text-foreground capitalize">
                      {type.replace(/_/g, ' ')}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {count} ({pct}%)
                    </Text>
                  </View>
                  <View
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: isDark ? '#27272A' : '#E5E7EB',
                    }}
                  >
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: '#818CF8',
                      }}
                    />
                  </View>
                </View>
              );
            }
          )}
        </View>
      )}
    </ScrollView>
  );
}
