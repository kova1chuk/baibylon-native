import React, { useMemo } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight } from 'lucide-react-native';
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
import { useGetGrammarLevelsQuery } from '@/entities/grammar/api/grammarApi';

import { useColors } from '@/hooks/useColors';

import type { GrammarLevelRow } from '@/entities/grammar/api/types';

const LEVEL_COLORS: Record<
  string,
  { gradient: [string, string]; primary: string }
> = {
  A1: { gradient: ['#6ee7b7', '#10B981'], primary: '#10B981' },
  A2: { gradient: ['#10B981', '#059669'], primary: '#059669' },
  B1: { gradient: ['#60a5fa', '#818cf8'], primary: '#3B82F6' },
  B2: { gradient: ['#a78bfa', '#8b5cf6'], primary: '#A855F7' },
  C1: { gradient: ['#fbbf24', '#f59e0b'], primary: '#F59E0B' },
  C2: { gradient: ['#fb7185', '#ef4444'], primary: '#EF4444' },
};

function isCurrentLevel(level: GrammarLevelRow): boolean {
  return !!level.started_at && !level.completed_at;
}

export default function GrammarLevelsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const { data: levels = [], isLoading, error } = useGetGrammarLevelsQuery();

  const foreground = isDark ? 'rgba(250,250,250,0.95)' : '#111827';
  const muted = isDark ? 'rgba(250,250,250,0.4)' : 'rgba(0,0,0,0.4)';
  const cardBg = isDark ? 'rgba(17,17,19,0.65)' : 'rgba(255,255,255,0.85)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const trackBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const separatorColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  const totalTopics = useMemo(
    () => levels.reduce((sum, l) => sum + l.total_topics, 0),
    [levels]
  );
  const completedTopics = useMemo(
    () => levels.reduce((sum, l) => sum + l.completed_topics, 0),
    [levels]
  );
  const currentLevel = useMemo(
    () => levels.find(l => isCurrentLevel(l)),
    [levels]
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={isDark ? '#6ee7b7' : '#10B981'}
        />
        <Text style={{ color: muted, marginTop: 8, fontSize: 13 }}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <BookOpen size={48} color={muted} />
        <Text
          style={{
            color: foreground,
            fontSize: 16,
            fontWeight: '600',
            marginTop: 16,
          }}
        >
          {t('grammarPage.noLevelsTitle')}
        </Text>
        <Text
          style={{
            color: muted,
            fontSize: 13,
            textAlign: 'center',
            marginTop: 4,
            paddingHorizontal: 32,
          }}
        >
          {t('grammarPage.noLevelsDesc')}
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
      {/* Header card */}
      <View
        style={[
          styles.headerCard,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
      >
        <LinearGradient
          colors={['rgba(129,140,248,0.4)', 'rgba(99,102,241,0.3)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentBar}
        />
        <View style={styles.headerRow}>
          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: isDark
                  ? 'rgba(129,140,248,0.12)'
                  : 'rgba(129,140,248,0.08)',
              },
            ]}
          >
            <BookOpen size={22} color="#818cf8" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: foreground }}>
            {t('grammarPage.title')}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 13,
            color: muted,
            lineHeight: 18,
            marginBottom: 14,
          }}
        >
          {t('grammarPage.description')}
        </Text>
        <View
          style={[
            styles.statsRow,
            {
              borderTopColor: separatorColor,
              borderTopWidth: 1,
              paddingTop: 12,
            },
          ]}
        >
          <View style={styles.statItem}>
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: 18,
                fontWeight: '700',
                color: foreground,
              }}
            >
              {totalTopics}
            </Text>
            <Text style={[styles.statLabelBase, { color: muted }]}>
              {t('grammarPage.totalTopics')}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: 18,
                fontWeight: '700',
                color: '#818cf8',
              }}
            >
              {completedTopics}
            </Text>
            <Text style={[styles.statLabelBase, { color: muted }]}>
              {t('grammarPage.completed')}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: 18,
                fontWeight: '700',
                color: foreground,
              }}
            >
              {currentLevel?.code ?? '\u2014'}
            </Text>
            <Text style={[styles.statLabelBase, { color: muted }]}>
              {t('grammarPage.currentLevel')}
            </Text>
          </View>
        </View>
      </View>

      {/* Level cards */}
      <View style={{ gap: 10, marginTop: 12 }}>
        {levels.map(level => {
          const lc = LEVEL_COLORS[level.code] ?? {
            gradient: ['#6B7280', '#4B5563'] as [string, string],
            primary: '#6B7280',
          };
          const pct = Math.round(level.progress_percentage);
          const current = isCurrentLevel(level);

          return (
            <Pressable
              key={level.id}
              style={({ pressed }) => [
                styles.levelCard,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() =>
                router.push(
                  `/grammar/level/${level.code.toLowerCase()}` as never
                )
              }
            >
              <LinearGradient
                colors={lc.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.accentBar}
              />
              <View style={{ padding: 14 }}>
                <View style={styles.levelRow}>
                  <View
                    style={[
                      styles.levelBadge,
                      {
                        backgroundColor: `${lc.primary}15`,
                        borderColor: `${lc.primary}30`,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: lc.primary,
                      }}
                    >
                      {level.code}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '600',
                          color: foreground,
                        }}
                      >
                        {level.name}
                      </Text>
                      {current && (
                        <View
                          style={{
                            backgroundColor: `${lc.primary}15`,
                            borderRadius: 100,
                            paddingHorizontal: 7,
                            paddingVertical: 2,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 9,
                              fontWeight: '600',
                              color: lc.primary,
                            }}
                          >
                            {t('grammarPage.current')}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 12,
                        color: muted,
                        marginTop: 2,
                        lineHeight: 16,
                      }}
                    >
                      {level.description}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={muted} />
                </View>

                <View style={{ marginTop: 12 }}>
                  <View style={styles.progressRow}>
                    <Text style={{ fontSize: 11, color: muted }}>
                      {t('grammarPage.progress')}
                    </Text>
                    <Text style={{ fontSize: 11 }}>
                      <Text style={{ color: lc.primary, fontWeight: '600' }}>
                        {level.completed_topics}
                      </Text>
                      <Text style={{ color: muted }}>
                        /{level.total_topics}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={[styles.progressTrack, { backgroundColor: trackBg }]}
                  >
                    <LinearGradient
                      colors={lc.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.progressFill,
                        { width: pct > 0 ? `${Math.max(2, pct)}%` : '0%' },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {levels.length === 0 && !isLoading && (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <BookOpen size={48} color={muted} style={{ opacity: 0.4 }} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: foreground,
              marginTop: 16,
              marginBottom: 6,
            }}
          >
            {t('grammarPage.noLevelsTitle')}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: muted,
              textAlign: 'center',
            }}
          >
            {t('grammarPage.noLevelsDesc')}
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
  headerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 16,
    paddingTop: 19,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabelBase: {
    fontFamily: 'monospace' as const,
    fontSize: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    marginTop: 2,
  },
  levelCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  levelBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
