import React from 'react';

import { Volume2 } from 'lucide-react-native';

import { View, Text, Pressable, ActivityIndicator } from 'react-native';

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
      <View className="items-center justify-center h-[120px]">
        <ActivityIndicator size="small" />
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
    <View className="bg-card rounded-2xl p-4 mx-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-foreground">
          Word of the Moment
        </Text>
        <Pressable className="p-2 active:opacity-50" onPress={() => refetch()}>
          <Text style={{ fontSize: 14 }}>🔄</Text>
        </Pressable>
      </View>

      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl font-bold text-foreground">
            {word.text}
          </Text>
          {word.phonetic_text && (
            <View className="flex-row items-center gap-1">
              <Volume2 size={14} color="#999" />
              <Text className="text-sm text-muted-foreground">
                {word.phonetic_text}
              </Text>
            </View>
          )}
        </View>

        {word.definition && (
          <Text className="text-sm text-muted-foreground" numberOfLines={2}>
            {word.definition}
          </Text>
        )}

        {word.translation && (
          <Text className="text-sm text-muted-foreground italic">
            {word.translation}
          </Text>
        )}

        <View
          className="self-start px-2 py-1 rounded-lg mt-1"
          style={{ backgroundColor: badge.bg }}
        >
          <Text className="text-xs font-medium" style={{ color: badge.text }}>
            {statusName}
          </Text>
        </View>
      </View>
    </View>
  );
}
