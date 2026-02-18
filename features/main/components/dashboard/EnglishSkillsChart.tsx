import React from 'react';

import { Text, View, XStack, YStack } from 'tamagui';

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
    <YStack
      backgroundColor="$background"
      borderRadius="$4"
      padding="$4"
      marginHorizontal="$4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={2}
      elevation={1}
    >
      <Text fontSize="$5" fontWeight="600" color="$color" marginBottom="$3">
        English Skills
      </Text>

      <YStack gap="$3">
        {SKILLS.map(skill => (
          <YStack key={skill.name} gap="$1">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" opacity={0.7}>
                {skill.name}
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$color">
                {skill.value}%
              </Text>
            </XStack>
            <View
              height={8}
              borderRadius={4}
              backgroundColor="$gray5"
              overflow="hidden"
            >
              <View
                height={8}
                borderRadius={4}
                backgroundColor={skill.color}
                width={`${skill.value}%`}
              />
            </View>
          </YStack>
        ))}
      </YStack>
    </YStack>
  );
}
