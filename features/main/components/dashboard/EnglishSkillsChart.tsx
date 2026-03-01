import React from 'react';

import { View, Text } from 'react-native';

interface Skill {
  name: string;
  value: number;
  color: string;
}

const SKILLS: Skill[] = [
  { name: 'Vocabulary', value: 72, color: '#10B981' },
  { name: 'Grammar', value: 58, color: '#3B82F6' },
  { name: 'Reading', value: 85, color: '#8B5CF6' },
  { name: 'Listening', value: 45, color: '#F59E0B' },
  { name: 'Writing', value: 62, color: '#EF4444' },
  { name: 'Speaking', value: 38, color: '#F97316' },
];

export default function EnglishSkillsChart() {
  return (
    <View className="bg-card rounded-2xl p-4 mx-4 shadow-sm">
      <Text className="text-lg font-semibold text-foreground mb-3">
        English Skills
      </Text>

      <View className="gap-3">
        {SKILLS.map(skill => (
          <View key={skill.name} className="gap-1">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-muted-foreground">
                {skill.name}
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
