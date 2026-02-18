import React from 'react';

import { Volume2 } from '@tamagui/lucide-icons';
import { Text, View, XStack, YStack, Spinner, Button } from 'tamagui';

import { useRandomWord } from '@/lib/api';

const STATUS_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  '1': { bg: '#6B728015', text: '#6B7280' },
  '2': { bg: '#EF444415', text: '#EF4444' },
  '3': { bg: '#F9731615', text: '#F97316' },
  '4': { bg: '#F59E0B15', text: '#F59E0B' },
  '5': { bg: '#3B82F615', text: '#3B82F6' },
  '6': { bg: '#10B98115', text: '#10B981' },
  '7': { bg: '#8B5CF615', text: '#8B5CF6' },
};

const STATUS_NAMES: Record<string, string> = {
  '1': 'Not Learned',
  '2': 'Beginner',
  '3': 'Basic',
  '4': 'Intermediate',
  '5': 'Advanced',
  '6': 'Well Known',
  '7': 'Mastered',
};

export default function WordOfTheMoment() {
  const { data: word, isLoading, refetch } = useRandomWord('en', 'uk');

  if (isLoading) {
    return (
      <View alignItems="center" justifyContent="center" height={120}>
        <Spinner size="small" />
      </View>
    );
  }

  if (!word) {
    return null;
  }

  const statusKey = String(word.status);
  const badge = STATUS_BADGE_COLORS[statusKey] || STATUS_BADGE_COLORS['1'];
  const statusName = STATUS_NAMES[statusKey] || 'Unknown';

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
      <XStack
        alignItems="center"
        justifyContent="space-between"
        marginBottom="$3"
      >
        <Text fontSize="$5" fontWeight="600" color="$color">
          Word of the Moment
        </Text>
        <Button
          size="$2"
          circular
          backgroundColor="transparent"
          onPress={() => refetch()}
        >
          <Text fontSize="$3">🔄</Text>
        </Button>
      </XStack>

      <YStack gap="$2">
        <XStack alignItems="center" gap="$2">
          <Text fontSize="$7" fontWeight="bold" color="$color">
            {word.text}
          </Text>
          {word.phonetic_text && (
            <XStack alignItems="center" gap="$1">
              <Volume2 size={14} opacity={0.4} />
              <Text fontSize="$3" opacity={0.5}>
                {word.phonetic_text}
              </Text>
            </XStack>
          )}
        </XStack>

        {word.definition && (
          <Text fontSize="$3" opacity={0.7} numberOfLines={2}>
            {word.definition}
          </Text>
        )}

        {word.translation && (
          <Text fontSize="$3" opacity={0.5} fontStyle="italic">
            {word.translation}
          </Text>
        )}

        <View
          alignSelf="flex-start"
          backgroundColor={badge.bg}
          paddingHorizontal="$2"
          paddingVertical="$1"
          borderRadius="$2"
          marginTop="$1"
        >
          <Text fontSize="$2" color={badge.text} fontWeight="500">
            {statusName}
          </Text>
        </View>
      </YStack>
    </YStack>
  );
}
