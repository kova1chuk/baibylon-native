import React from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  Brain,
  ChevronRight,
  Flame,
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
  StyleSheet,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { useGetUnifiedQueueQuery } from '@/entities/dictionary/api/dictionaryApi';
import {
  useGetDailyProgressQuery,
  useGetStreakInfoQuery,
} from '@/entities/learning-queue/api/multiSessionApi';

import { useColors } from '@/hooks/useColors';

const TYPE_COLORS: Record<string, string> = {
  word: '#6ee7b7',
  phrase: '#818cf8',
  grammar_rule: '#fbbf24',
  grammar_vocabulary: '#f59e0b',
  irregular_verb: '#fb7185',
  error_pattern: '#ef4444',
};

interface TrainingHubScreenProps {
  onStartSession: () => void;
}

export default function TrainingHubScreen({
  onStartSession,
}: TrainingHubScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = useColors();

  const {
    data: queueItems,
    isLoading: queueLoading,
    isError: queueError,
  } = useGetUnifiedQueueQuery({ size: 20 });
  const { data: dailyProgress } = useGetDailyProgressQuery();
  const { data: streak } = useGetStreakInfoQuery();

  const foreground = isDark ? 'rgba(250,250,250,0.95)' : '#111827';
  const muted = isDark ? 'rgba(250,250,250,0.4)' : 'rgba(0,0,0,0.4)';
  const cardBg = isDark ? 'rgba(17,17,19,0.65)' : 'rgba(255,255,255,0.85)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const trackBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const queueSize = queueItems?.length ?? 0;
  const typeCounts =
    queueItems?.reduce(
      (acc, item) => {
        acc[item.itemType] = (acc[item.itemType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) ?? {};

  const dailyPct = dailyProgress?.tier1Threshold
    ? Math.min(
        100,
        (dailyProgress.todayScore / dailyProgress.tier1Threshold) * 100
      )
    : 0;

  if (queueLoading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={isDark ? '#818cf8' : '#6366f1'}
        />
        <Text style={{ color: muted, marginTop: 8, fontSize: 13 }}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 100,
      }}
    >
      {/* Title */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Zap size={20} color={isDark ? '#818cf8' : '#6366f1'} />
        <Text style={{ fontSize: 20, fontWeight: '700', color: foreground }}>
          {t('training.title')}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <Target size={16} color="#818cf8" />
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 18,
              fontWeight: '700',
              color: foreground,
              marginTop: 4,
            }}
          >
            {queueSize}
          </Text>
          <Text style={[styles.statLabelBase, { color: muted }]}>
            {t('training.items')}
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <Zap size={16} color="#f59e0b" />
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 18,
              fontWeight: '700',
              color: foreground,
              marginTop: 4,
            }}
          >
            {dailyProgress?.exercisesCompleted ?? 0}
          </Text>
          <Text style={[styles.statLabelBase, { color: muted }]}>
            {t('training.completedToday')}
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <Flame size={16} color="#10B981" />
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 18,
              fontWeight: '700',
              color: foreground,
              marginTop: 4,
            }}
          >
            {streak?.currentStreak ?? 0}d
          </Text>
          <Text style={[styles.statLabelBase, { color: muted }]}>Streak</Text>
        </View>
      </View>

      {/* Daily Progress */}
      {dailyProgress && dailyProgress.tier1Threshold > 0 && (
        <View
          style={[
            styles.glassCard,
            {
              backgroundColor: cardBg,
              borderColor: cardBorder,
              marginBottom: 12,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(129,140,248,0.4)', 'rgba(99,102,241,0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.accentBar}
          />
          <View style={{ padding: 14, paddingTop: 17 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: '600', color: foreground }}
              >
                {t('training.dailyTab')}
              </Text>
              <Text
                style={{ fontFamily: 'monospace', fontSize: 12, color: muted }}
              >
                {dailyProgress.todayScore} / {dailyProgress.tier1Threshold}
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: trackBg }]}>
              <LinearGradient
                colors={
                  dailyProgress.currentTier >= 1
                    ? ['#6ee7b7', '#10b981']
                    : ['#818cf8', '#6366f1']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  { width: dailyPct > 0 ? `${Math.max(2, dailyPct)}%` : '0%' },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {/* Smart Session CTA */}
      <Pressable
        style={({ pressed }) => [
          styles.glassCard,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            opacity: pressed ? 0.8 : 1,
            marginBottom: 12,
          },
        ]}
        onPress={onStartSession}
      >
        <LinearGradient
          colors={['rgba(129,140,248,0.5)', 'rgba(110,231,183,0.3)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentBar}
        />
        <View style={{ padding: 14, paddingTop: 17 }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}
          >
            <View
              style={[
                styles.sessionIcon,
                {
                  backgroundColor: isDark
                    ? 'rgba(129,140,248,0.12)'
                    : 'rgba(129,140,248,0.08)',
                },
              ]}
            >
              <Brain size={22} color="#818cf8" />
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Text
                  style={{ fontSize: 15, fontWeight: '600', color: foreground }}
                >
                  {t('training.smartSession')}
                </Text>
                {queueSize > 0 && (
                  <View
                    style={{
                      backgroundColor: 'rgba(129,140,248,0.15)',
                      borderRadius: 100,
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        fontWeight: '600',
                        color: '#818cf8',
                      }}
                    >
                      {queueSize} {t('training.items')}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: muted,
                  marginTop: 3,
                  lineHeight: 17,
                }}
              >
                {t('training.smartSessionDesc')}
              </Text>
            </View>
            <ChevronRight size={16} color={muted} />
          </View>
        </View>
      </Pressable>

      {/* Queue Composition */}
      {queueSize > 0 && (
        <View
          style={[
            styles.glassCard,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <View style={{ padding: 14 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginBottom: 12,
              }}
            >
              <BookOpen size={14} color={muted} />
              <Text
                style={{ fontSize: 13, fontWeight: '600', color: foreground }}
              >
                {t('training.queueComposition')}
              </Text>
            </View>
            <View style={{ gap: 10 }}>
              {Object.entries(typeCounts).map(([type, count]) => {
                const pct = Math.round((count / queueSize) * 100);
                const typeColor = TYPE_COLORS[type] ?? '#818cf8';
                return (
                  <View key={type}>
                    <View style={styles.queueRow}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: typeColor,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 13,
                            color: foreground,
                            textTransform: 'capitalize',
                          }}
                        >
                          {type.replace(/_/g, ' ')}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 11,
                          color: muted,
                        }}
                      >
                        {count} ({pct}%)
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.progressTrack,
                        { backgroundColor: trackBg },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${pct}%`,
                            backgroundColor: typeColor,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* Empty / Error state */}
      {(queueSize === 0 || queueError) && !queueLoading && (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <Zap size={48} color={muted} style={{ opacity: 0.4 }} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: foreground,
              marginTop: 16,
              marginBottom: 6,
            }}
          >
            {queueError ? t('common.error') : t('training.allDoneTitle')}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: muted,
              textAlign: 'center',
            }}
          >
            {queueError ? t('common.tryAgain') : t('training.allDoneDesc')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  statLabelBase: {
    fontFamily: 'monospace' as const,
    fontSize: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    marginTop: 2,
  },
  glassCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  sessionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressTrack: {
    height: 4,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
  },
});
