import React from 'react';

import {
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Dumbbell,
  Target,
  Zap,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { useGetUnifiedQueueQuery } from '@/entities/dictionary/api/dictionaryApi';
import {
  useGetDailyProgressQuery,
  useGetStreakInfoQuery,
} from '@/entities/learning-queue/api/multiSessionApi';

import { useColors } from '@/hooks/useColors';

interface SessionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
  onPress: () => void;
  isDark: boolean;
  badge?: string;
}

function SessionCard({
  icon,
  title,
  description,
  accentColor,
  onPress,
  isDark,
  badge,
}: SessionCardProps) {
  return (
    <Pressable
      className="bg-card rounded-2xl overflow-hidden active:opacity-80"
      onPress={onPress}
    >
      <View style={{ height: 3, backgroundColor: accentColor }} />
      <View className="p-4">
        <View className="flex-row items-start gap-3">
          <View
            className="w-11 h-11 rounded-xl items-center justify-center"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            {icon}
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-semibold text-foreground">
                {title}
              </Text>
              {badge ? (
                <View
                  className="rounded-full px-2 py-0.5"
                  style={{ backgroundColor: `${accentColor}15` }}
                >
                  <Text
                    className="text-[10px] font-medium"
                    style={{ color: accentColor }}
                  >
                    {badge}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              className="text-xs text-muted-foreground mt-0.5"
              numberOfLines={2}
            >
              {description}
            </Text>
          </View>
          <ChevronRight
            size={16}
            color={isDark ? '#FAFAF9' : '#111827'}
            opacity={0.4}
          />
        </View>
      </View>
    </Pressable>
  );
}

interface QuickStatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isDark: boolean;
}

function QuickStat({ label, value, icon, isDark }: QuickStatProps) {
  return (
    <View
      className="flex-1 rounded-xl p-3 items-center"
      style={{
        backgroundColor: isDark ? '#111113' : '#FFFFFF',
        borderWidth: 1,
        borderColor: isDark ? '#27272A' : '#E7E5E4',
      }}
    >
      {icon}
      <Text className="text-lg font-bold text-foreground mt-1">{value}</Text>
      <Text className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </Text>
    </View>
  );
}

interface TrainingHubScreenProps {
  onStartSession: () => void;
}

export default function TrainingHubScreen({
  onStartSession,
}: TrainingHubScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = useColors();

  const { data: queueItems, isLoading: queueLoading } = useGetUnifiedQueueQuery(
    { size: 20 }
  );
  const { data: dailyProgress } = useGetDailyProgressQuery();
  const { data: streak } = useGetStreakInfoQuery();

  const queueSize = queueItems?.length ?? 0;

  const typeCounts =
    queueItems?.reduce(
      (acc, item) => {
        acc[item.itemType] = (acc[item.itemType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) ?? {};

  if (queueLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-4">
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 16,
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <View className="flex-row items-center gap-2 mb-5">
        <Dumbbell size={20} color={isDark ? '#818CF8' : '#6366F1'} />
        <Text className="text-xl font-bold text-foreground">
          {t('training.title')}
        </Text>
      </View>

      {/* Quick Stats */}
      <View className="flex-row gap-3 mb-5">
        <QuickStat
          label={t('training.items')}
          value={queueSize}
          icon={<Target size={16} color="#818CF8" />}
          isDark={isDark}
        />
        <QuickStat
          label={t('training.completedToday')}
          value={dailyProgress?.exercisesCompleted ?? 0}
          icon={<Zap size={16} color="#F59E0B" />}
          isDark={isDark}
        />
        <QuickStat
          label="Streak"
          value={`${streak?.currentStreak ?? 0}d`}
          icon={<Clock size={16} color="#10B981" />}
          isDark={isDark}
        />
      </View>

      {/* Daily Progress Bar */}
      {dailyProgress && dailyProgress.tier1Threshold > 0 && (
        <View
          className="bg-card rounded-2xl p-4 mb-5"
          style={{
            borderWidth: 1,
            borderColor: isDark ? '#27272A' : '#E7E5E4',
          }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-semibold text-foreground">
              {t('training.dailyTab')}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {dailyProgress.todayScore} / {dailyProgress.tier1Threshold}
            </Text>
          </View>
          <View
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: isDark ? '#27272A' : '#E5E7EB' }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (dailyProgress.todayScore / dailyProgress.tier1Threshold) * 100)}%`,
                backgroundColor:
                  dailyProgress.currentTier >= 1 ? '#10B981' : '#818CF8',
              }}
            />
          </View>
        </View>
      )}

      {/* Session Types */}
      <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {t('training.startButton')}
      </Text>

      <View className="gap-3 mb-5">
        <SessionCard
          icon={<Brain size={22} color="#818CF8" />}
          title={t('training.smartSession')}
          description={t('training.smartSessionDesc')}
          accentColor="#818CF8"
          badge={
            queueSize > 0 ? `${queueSize} ${t('training.items')}` : undefined
          }
          onPress={onStartSession}
          isDark={isDark}
        />
      </View>

      {/* Queue Composition */}
      {queueSize > 0 && (
        <View
          className="bg-card rounded-2xl p-4"
          style={{
            borderWidth: 1,
            borderColor: isDark ? '#27272A' : '#E7E5E4',
          }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <BookOpen size={14} color={isDark ? '#52525B' : '#9CA3AF'} />
            <Text className="text-sm font-semibold text-foreground">
              {t('training.queueComposition')}
            </Text>
          </View>
          <View className="gap-2">
            {Object.entries(typeCounts).map(([type, count]) => {
              const total = queueSize;
              const pct = Math.round((count / total) * 100);
              return (
                <View key={type}>
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
            })}
          </View>
        </View>
      )}

      {queueSize === 0 && (
        <View className="py-12 items-center">
          <Dumbbell
            size={48}
            color={isDark ? '#52525B' : '#A1A1AA'}
            opacity={0.4}
          />
          <Text className="text-lg font-semibold text-foreground mt-4 mb-2">
            {t('training.allDoneTitle')}
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            {t('training.allDoneDesc')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
