import React from 'react';

import { useTranslation } from 'react-i18next';

import { View, Text, ActivityIndicator } from 'react-native';

import { useGetDashboardHomeQuery } from '@/features/hub/api/dashboardApi';

interface Skill {
  labelKey: string;
  value: number;
  color: string;
}

export default function EnglishSkillsChart() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetDashboardHomeQuery();

  if (isLoading) {
    return (
      <View className="items-center justify-center h-[200px]">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  const skills: Skill[] = [
    {
      labelKey: 'hub.words',
      value: data?.skillVocabulary ?? 0,
      color: '#10B981',
    },
    {
      labelKey: 'hub.grammar',
      value: data?.skillGrammar ?? 0,
      color: '#3B82F6',
    },
    {
      labelKey: 'learningFeed.vocabulary',
      value: data?.skillReading ?? 0,
      color: '#8B5CF6',
    },
    {
      labelKey: 'hub.timeSpent',
      value: data?.skillListening ?? 0,
      color: '#F59E0B',
    },
  ];

  return (
    <View className="bg-card rounded-2xl p-4 mx-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-foreground">
          {t('hub.currentLevel')}
        </Text>
        {data?.cefrLevel && (
          <Text className="text-sm font-semibold text-primary">
            {data.cefrLevel}
          </Text>
        )}
      </View>

      <View className="gap-3">
        {skills.map(skill => (
          <View key={skill.labelKey} className="gap-1">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-muted-foreground">
                {t(skill.labelKey)}
              </Text>
              <Text className="text-sm font-semibold text-foreground">
                {skill.value}%
              </Text>
            </View>
            <View className="h-2 rounded-full bg-muted overflow-hidden">
              <View
                className="h-2 rounded-full"
                style={{
                  backgroundColor: skill.color,
                  width: `${skill.value}%`,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
