import React, { useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertTriangle,
  BookOpen,
  Brain,
  CalendarDays,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  Sparkles,
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
  useGetDailyPlanQuery,
  useGetDailyProgressQuery,
  useGetStreakInfoQuery,
} from '@/entities/learning-queue/api/multiSessionApi';

import { useColors } from '@/hooks/useColors';

import type {
  DailyPlanSection,
  DailySectionKey,
} from '@/entities/learning-queue/api/types';

const TYPE_COLORS: Record<string, string> = {
  word: '#6ee7b7',
  phrase: '#818cf8',
  grammar_rule: '#fbbf24',
  grammar_vocabulary: '#f59e0b',
  irregular_verb: '#fb7185',
  error_pattern: '#ef4444',
};

const SECTION_CONFIG: {
  key: DailySectionKey;
  icon: typeof Clock;
  color: string;
  gradient: [string, string];
}[] = [
  {
    key: 'review',
    icon: Clock,
    color: '#f59e0b',
    gradient: ['#fbbf24', '#f59e0b'],
  },
  {
    key: 'errors',
    icon: AlertTriangle,
    color: '#fb7185',
    gradient: ['#fb7185', '#ef4444'],
  },
  {
    key: 'newWords',
    icon: Sparkles,
    color: '#6ee7b7',
    gradient: ['#6ee7b7', '#10b981'],
  },
  {
    key: 'grammar',
    icon: BookOpen,
    color: '#818cf8',
    gradient: ['#818cf8', '#6366f1'],
  },
];

const SECTION_LABELS: Record<DailySectionKey, string> = {
  review: 'Review',
  errors: 'Errors',
  newWords: 'New Words',
  grammar: 'Grammar',
};

const EXERCISE_GROUPS = [
  {
    title: 'Vocabulary',
    color: '#6ee7b7',
    gradient: ['#6ee7b7', '#10b981'] as [string, string],
    types: ['word'],
    exercises: [
      'Flashcards',
      'Multiple Choice',
      'Type the Word',
      'Context Fill',
      'Odd One Out',
    ],
  },
  {
    title: 'Grammar',
    color: '#818cf8',
    gradient: ['#818cf8', '#6366f1'] as [string, string],
    types: ['grammar_rule', 'grammar_vocabulary'],
    exercises: [
      'Rule Quiz',
      'Fill the Gap',
      'Error Correction',
      'Sentence Builder',
    ],
  },
  {
    title: 'Irregular Verbs',
    color: '#22d3ee',
    gradient: ['#22d3ee', '#06b6d4'] as [string, string],
    types: ['irregular_verb'],
    exercises: ['Verb Forms Drill', 'Irregular Sort'],
  },
  {
    title: 'Phrases & Idioms',
    color: '#2dd4bf',
    gradient: ['#2dd4bf', '#14b8a6'] as [string, string],
    types: ['phrase'],
    exercises: ['Phrase Builder', 'Idiom Match'],
  },
  {
    title: 'Review & Mixed',
    color: '#f59e0b',
    gradient: ['#f59e0b', '#f97316'] as [string, string],
    types: ['error_pattern'],
    exercises: ['Spaced Review', 'Translate Sentence'],
  },
];

type Tab = 'daily' | 'exercises';

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
  const [activeTab, setActiveTab] = useState<Tab>('daily');

  const {
    data: queueItems,
    isLoading: queueLoading,
    isError: queueError,
    refetch: refetchQueue,
  } = useGetUnifiedQueueQuery({ size: 50 });
  const { data: dailyProgress } = useGetDailyProgressQuery();
  const { data: dailyPlan } = useGetDailyPlanQuery();
  const { data: streak } = useGetStreakInfoQuery();

  const foreground = isDark ? 'rgba(250,250,250,0.95)' : '#111827';
  const muted = isDark ? 'rgba(250,250,250,0.4)' : 'rgba(0,0,0,0.4)';
  const cardBg = isDark ? 'rgba(17,17,19,0.65)' : 'rgba(255,255,255,0.85)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const trackBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const tabBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
  const tabActiveBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const tabBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

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

  const remainingExercises = dailyPlan
    ? Object.values(dailyPlan.sections).reduce(
        (sum, s) => sum + Math.max(0, s.total - s.completedToday),
        0
      )
    : 0;

  if (queueLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
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
        paddingTop: 8,
        paddingBottom: insets.bottom + 100,
      }}
    >
      {/* Quick Stats Row */}
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

      {/* Daily Progress Bar */}
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

      {/* Start Session CTA */}
      <Pressable
        style={({ pressed }) => [
          styles.glassCard,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            opacity: pressed ? 0.8 : 1,
            marginBottom: 16,
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

      {/* Tab Navigation */}
      <View
        style={{
          flexDirection: 'row',
          gap: 6,
          marginBottom: 16,
          padding: 6,
          borderRadius: 12,
          backgroundColor: tabBg,
          borderWidth: 1,
          borderColor: tabBorder,
        }}
      >
        {(
          [
            {
              key: 'daily' as Tab,
              label: t('training.dailyTab'),
              icon: CalendarDays,
              count: remainingExercises,
            },
            {
              key: 'exercises' as Tab,
              label: t('training.exercisesTab'),
              icon: GraduationCap,
              count: 0,
            },
          ] as const
        ).map(tab => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: isActive ? tabActiveBg : 'transparent',
                borderWidth: isActive ? 1 : 0,
                borderColor: isActive ? tabBorder : 'transparent',
              }}
            >
              <Icon size={15} color={isActive ? foreground : muted} />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? foreground : muted,
                }}
              >
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(129,140,248,0.15)'
                      : 'rgba(129,140,248,0.08)',
                    borderRadius: 6,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
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
                    {tab.count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Daily Tab Content */}
      {activeTab === 'daily' && (
        <View style={{ gap: 10 }}>
          {dailyPlan &&
            SECTION_CONFIG.map(({ key, icon: Icon, color, gradient }) => {
              const section: DailyPlanSection | undefined =
                dailyPlan.sections[key];
              if (!section || section.total === 0) return null;
              const remaining = Math.max(
                0,
                section.total - section.completedToday
              );
              const isDone = remaining === 0;
              return (
                <Pressable
                  key={key}
                  onPress={onStartSession}
                  style={({ pressed }) => [
                    styles.glassCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: cardBorder,
                      opacity: pressed ? 0.85 : isDone ? 0.5 : 1,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.accentBar}
                  />
                  <View style={{ padding: 14, paddingTop: 17 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          backgroundColor: `${color}15`,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={18} color={color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: foreground,
                            }}
                          >
                            {SECTION_LABELS[key]}
                          </Text>
                          <View
                            style={{
                              backgroundColor: `${color}15`,
                              borderRadius: 100,
                              paddingHorizontal: 6,
                              paddingVertical: 1,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: 'monospace',
                                fontSize: 10,
                                fontWeight: '600',
                                color,
                              }}
                            >
                              {isDone
                                ? `${section.completedToday}/${section.total}`
                                : `${remaining}`}
                            </Text>
                          </View>
                        </View>
                        {section.previewItems.length > 0 && (
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 11,
                              color: muted,
                              marginTop: 3,
                            }}
                          >
                            {section.previewItems
                              .slice(0, 3)
                              .map(i => i.title)
                              .join(', ')}
                          </Text>
                        )}
                      </View>
                      <ChevronRight size={14} color={muted} />
                    </View>
                  </View>
                </Pressable>
              );
            })}

          {/* Queue Composition */}
          {queueSize > 0 && (
            <View
              style={[
                styles.glassCard,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  marginTop: 4,
                },
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
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: foreground,
                    }}
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
              {queueError && (
                <Pressable
                  onPress={refetchQueue}
                  style={{
                    marginTop: 16,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: isDark
                      ? 'rgba(129,140,248,0.15)'
                      : 'rgba(99,102,241,0.1)',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#818cf8',
                    }}
                  >
                    {t('common.retry') || 'Retry'}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}

      {/* Exercises Tab Content */}
      {activeTab === 'exercises' && (
        <View style={{ gap: 16 }}>
          {EXERCISE_GROUPS.map(group => {
            const groupItemCount = group.types.reduce(
              (sum, type) => sum + (typeCounts[type] ?? 0),
              0
            );
            return (
              <View key={group.title}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: group.color,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: foreground,
                    }}
                  >
                    {group.title}
                  </Text>
                  {groupItemCount > 0 && (
                    <Text
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 11,
                        color: muted,
                      }}
                    >
                      {groupItemCount} items
                    </Text>
                  )}
                </View>
                <View style={{ gap: 8 }}>
                  {group.exercises.map(exercise => (
                    <Pressable
                      key={exercise}
                      onPress={onStartSession}
                      style={({ pressed }) => [
                        styles.glassCard,
                        {
                          backgroundColor: cardBg,
                          borderColor: cardBorder,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={group.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.accentBar}
                      />
                      <View
                        style={{
                          padding: 14,
                          paddingTop: 17,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: `${group.color}15`,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <GraduationCap size={16} color={group.color} />
                        </View>
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 14,
                            fontWeight: '500',
                            color: foreground,
                          }}
                        >
                          {exercise}
                        </Text>
                        <ChevronRight size={14} color={muted} />
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          })}
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
