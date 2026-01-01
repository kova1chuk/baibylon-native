import React from 'react';

import { Text, YStack, XStack, Button } from 'tamagui';

import { FlatList } from 'react-native';

import type { Word, WordStatus } from '@/lib/api/types';

interface WordsListProps {
  words: Word[];
  onWordPress?: (word: Word) => void;
  onStatusFilterChange?: (status: WordStatus | 'all') => void;
  selectedStatus?: WordStatus | 'all';
}

const STATUS_LABELS: Record<WordStatus | 'all', string> = {
  '1': 'Not Learned',
  '2': 'Beginner',
  '3': 'Basic',
  '4': 'Intermediate',
  '5': 'Advanced',
  '6': 'Well Known',
  '7': 'Mastered',
  all: 'All',
};

const STATUS_COLORS: Record<WordStatus | 'all', string> = {
  '1': '#6B7280', // gray
  '2': '#EF4444', // red
  '3': '#F97316', // orange
  '4': '#F59E0B', // yellow/orange
  '5': '#3B82F6', // blue
  '6': '#10B981', // green
  '7': '#8B5CF6', // purple
  all: '#6B7280',
};

export default function WordsList({
  words,
  onWordPress,
  onStatusFilterChange,
  selectedStatus = 'all',
}: WordsListProps) {
  const statusFilters: { key: WordStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: '1', label: 'Not Learned' },
    { key: '2', label: 'Beginner' },
    { key: '3', label: 'Basic' },
    { key: '4', label: 'Intermediate' },
    { key: '5', label: 'Advanced' },
    { key: '6', label: 'Well Known' },
    { key: '7', label: 'Mastered' },
  ];

  const renderStatusFilter = ({
    item,
  }: {
    item: { key: WordStatus | 'all'; label: string };
  }) => {
    const isSelected = selectedStatus === item.key;
    const color = STATUS_COLORS[item.key];

    return (
      <Button
        size="$3"
        borderWidth={1}
        borderColor={isSelected ? color : '$borderColor'}
        backgroundColor={isSelected ? color : 'transparent'}
        color={isSelected ? 'white' : '$color'}
        fontWeight="500"
        onPress={() => onStatusFilterChange?.(item.key)}
        minWidth={80}
      >
        {item.label}
      </Button>
    );
  };

  const renderWordItem = ({ item }: { item: Word }) => {
    const color = STATUS_COLORS[item.status];
    const label = STATUS_LABELS[item.status];

    return (
      <Button
        unstyled
        onPress={() => onWordPress?.(item)}
        padding={0}
        marginBottom="$3"
      >
        <YStack
          padding="$4"
          borderRadius="$3"
          backgroundColor="$background"
          borderLeftWidth={4}
          borderLeftColor={color}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={4}
        >
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$2"
          >
            <Text fontSize="$6" fontWeight="600" color="$color" flex={1}>
              {item.word}
            </Text>
            <XStack
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$3"
              backgroundColor={color}
            >
              <Text fontSize="$2" fontWeight="500" color="white">
                {label}
              </Text>
            </XStack>
          </XStack>

          <Text fontSize="$4" marginBottom="$2" opacity={0.8} color="$color">
            {item.translation}
          </Text>

          {item.definition && (
            <Text
              fontSize="$3"
              marginBottom="$3"
              opacity={0.6}
              fontStyle="italic"
              color="$color"
              numberOfLines={2}
            >
              {item.definition}
            </Text>
          )}

          <XStack justifyContent="space-between">
            <YStack alignItems="center">
              <Text fontSize="$2" opacity={0.6} color="$color">
                Usage
              </Text>
              <Text fontSize="$4" fontWeight="600" color="$color">
                {item.usageCount}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </Button>
    );
  };

  return (
    <YStack flex={1}>
      {/* Status Filters */}
      <YStack
        paddingVertical="$4"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <FlatList
          data={statusFilters}
          renderItem={renderStatusFilter}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        />
      </YStack>

      {/* Words List */}
      <FlatList
        data={words}
        renderItem={renderWordItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <YStack alignItems="center" paddingVertical="$10">
            <Text fontSize="$4" opacity={0.6} color="$color">
              No words found for the selected filter.
            </Text>
          </YStack>
        }
      />
    </YStack>
  );
}
