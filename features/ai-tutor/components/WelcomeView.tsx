import React, { useCallback } from 'react';

import { Bot, MessageSquare, Sparkles, Type } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { View, Text, Pressable, ScrollView } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { useGetWeeklyStatsQuery } from '@/shared/api/tutorApi';

import { useColors } from '@/hooks/useColors';

import type { TutorMode } from '../model/aiTutorSlice';

interface WelcomeViewProps {
  mode: TutorMode;
  onModeChange: (mode: TutorMode) => void;
  onStartChat: () => void;
}

const MODES: {
  key: TutorMode;
  labelKey: string;
  descKey: string;
  color: string;
  Icon: typeof Sparkles;
}[] = [
  {
    key: 'adaptive',
    labelKey: 'aiTutor.modeAdaptive',
    descKey: 'aiTutor.modeAdaptiveDesc',
    color: '#10B981',
    Icon: Sparkles,
  },
  {
    key: 'free-talk',
    labelKey: 'aiTutor.modeFreeTalk',
    descKey: 'aiTutor.modeFreeTalkDesc',
    color: '#3B82F6',
    Icon: MessageSquare,
  },
  {
    key: 'grammar',
    labelKey: 'aiTutor.modeGrammarFocus',
    descKey: 'aiTutor.modeGrammarFocusDesc',
    color: '#A855F7',
    Icon: Type,
  },
];

export default function WelcomeView({
  mode,
  onModeChange,
  onStartChat,
}: WelcomeViewProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = useColors();

  const { data: weeklyStats } = useGetWeeklyStatsQuery();

  const handleModeSelect = useCallback(
    (m: TutorMode) => {
      onModeChange(m);
    },
    [onModeChange]
  );

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, flexGrow: 1 }}
    >
      <View className="items-center mb-8 mt-4">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: isDark ? '#1C1C1E' : '#F5F5F4' }}
        >
          <Bot size={32} color={isDark ? '#6EE7B7' : '#10B981'} />
        </View>
        <Text className="text-2xl font-bold text-foreground mb-2">
          {t('aiTutor.welcome.titleAccent')}
        </Text>
        <Text className="text-base text-muted-foreground text-center">
          {t('aiTutor.welcome.description')}
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-sm font-semibold text-foreground mb-3">
          {t('aiTutor.welcome.chooseMode')}
        </Text>
        <View className="gap-3">
          {MODES.map(({ key, labelKey, descKey, color, Icon }) => {
            const isActive = mode === key;
            return (
              <Pressable
                key={key}
                onPress={() => handleModeSelect(key)}
                className="rounded-xl p-4 active:opacity-80"
                style={{
                  borderWidth: 2,
                  borderColor: isActive
                    ? color
                    : isDark
                      ? '#27272A'
                      : '#E7E5E4',
                  backgroundColor: isActive
                    ? `${color}10`
                    : isDark
                      ? '#111113'
                      : '#FFFFFF',
                }}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon size={20} color={color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {t(labelKey)}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {t(descKey)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {weeklyStats && (
        <View className="bg-card rounded-xl p-4 mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            {t('aiTutor.welcome.weeklyActivity')}
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-foreground">
                {weeklyStats.totalSessions}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {t('aiTutor.welcome.sessions')}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-foreground">
                {weeklyStats.totalMessages}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {t('aiTutor.welcome.messages')}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-foreground">
                {weeklyStats.avgAccuracy}%
              </Text>
              <Text className="text-xs text-muted-foreground">
                {t('aiTutor.welcome.accuracyLabel')}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="mt-auto">
        <Pressable
          className="bg-primary rounded-xl py-4 items-center active:opacity-80"
          onPress={onStartChat}
        >
          <Text className="text-white font-semibold text-base">
            {t('aiTutor.welcome.startNewChat')}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
