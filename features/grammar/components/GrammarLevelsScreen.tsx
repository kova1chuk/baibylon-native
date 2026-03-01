import React, { useMemo } from 'react';

import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { useGetGrammarLevelsQuery } from '@/entities/grammar/api/grammarApi';

import { useColors } from '@/hooks/useColors';

import type { GrammarLevelRow } from '@/entities/grammar/api/types';

const LEVEL_COLORS: Record<string, { primary: string; light: string }> = {
  A1: { primary: '#10B981', light: '#10B98120' },
  A2: { primary: '#059669', light: '#05966920' },
  B1: { primary: '#3B82F6', light: '#3B82F620' },
  B2: { primary: '#A855F7', light: '#A855F720' },
  C1: { primary: '#F59E0B', light: '#F59E0B20' },
  C2: { primary: '#EF4444', light: '#EF444420' },
};

function isCurrentLevel(level: GrammarLevelRow): boolean {
  return !!level.started_at && !level.completed_at;
}

export default function GrammarLevelsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = useColors();

  const { data: levels = [], isLoading, error } = useGetGrammarLevelsQuery();

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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-destructive text-center">
          {t('grammarPage.noLevelsTitle')}
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
      <View className="bg-card rounded-2xl p-5 mb-5">
        <View className="flex-row items-center gap-3 mb-3">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: isDark ? '#1C1C1E' : '#F5F5F4' }}
          >
            <BookOpen size={24} color={isDark ? '#6EE7B7' : '#10B981'} />
          </View>
          <Text className="text-2xl font-bold text-foreground">
            {t('grammarPage.title')}
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground mb-4">
          {t('grammarPage.description')}
        </Text>
        <View className="flex-row gap-6">
          <View>
            <Text className="text-xs text-muted-foreground uppercase tracking-wider">
              {t('grammarPage.totalTopics')}
            </Text>
            <Text className="text-xl font-bold text-foreground">
              {totalTopics}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-muted-foreground uppercase tracking-wider">
              {t('grammarPage.completed')}
            </Text>
            <Text className="text-xl font-bold text-foreground">
              {completedTopics}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-muted-foreground uppercase tracking-wider">
              {t('grammarPage.currentLevel')}
            </Text>
            <Text className="text-xl font-bold text-foreground">
              {currentLevel?.code ?? '\u2014'}
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-3">
        {levels.map(level => {
          const colors = LEVEL_COLORS[level.code] ?? {
            primary: '#6B7280',
            light: '#6B728020',
          };
          const pct = Math.round(level.progress_percentage);
          const current = isCurrentLevel(level);

          return (
            <Pressable
              key={level.id}
              className="bg-card rounded-xl overflow-hidden active:opacity-80"
              onPress={() =>
                router.push(
                  `/grammar/level/${level.code.toLowerCase()}` as never
                )
              }
            >
              <View
                style={{
                  height: 3,
                  backgroundColor: colors.primary,
                }}
              />
              <View className="p-4">
                <View className="flex-row items-start gap-3 mb-3">
                  <View
                    className="w-11 h-11 rounded-lg items-center justify-center"
                    style={{
                      backgroundColor: colors.light,
                      borderWidth: 1,
                      borderColor: `${colors.primary}30`,
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{ color: colors.primary }}
                    >
                      {level.code}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-foreground">
                        {level.name}
                      </Text>
                      {current && (
                        <View
                          className="rounded-full px-2 py-0.5"
                          style={{ backgroundColor: `${colors.primary}15` }}
                        >
                          <Text
                            className="text-[10px] font-medium"
                            style={{ color: colors.primary }}
                          >
                            {t('grammarPage.current')}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      className="text-xs text-muted-foreground mt-0.5"
                      numberOfLines={2}
                    >
                      {level.description}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-xs text-muted-foreground">
                    {t('grammarPage.progress')}
                  </Text>
                  <Text className="text-xs">
                    <Text style={{ color: colors.primary }}>
                      {level.completed_topics}
                    </Text>
                    <Text className="text-muted-foreground">
                      /{level.total_topics}
                    </Text>
                  </Text>
                </View>
                <View
                  className="h-1 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: isDark ? '#27272A' : '#E5E7EB',
                  }}
                >
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: colors.primary,
                    }}
                  />
                </View>

                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-xs text-muted-foreground">
                    {t('grammarPage.complete', { pct })}
                  </Text>
                  <ChevronRight
                    size={16}
                    color={isDark ? '#FAFAF9' : '#111827'}
                    opacity={0.4}
                  />
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {levels.length === 0 && !isLoading && (
        <View className="py-12 items-center">
          <BookOpen
            size={48}
            color={isDark ? '#52525B' : '#A1A1AA'}
            opacity={0.4}
          />
          <Text className="text-lg font-semibold text-foreground mt-4 mb-2">
            {t('grammarPage.noLevelsTitle')}
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            {t('grammarPage.noLevelsDesc')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
