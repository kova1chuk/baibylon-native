import React from 'react';

import { View, Text, Pressable, FlatList } from 'react-native';

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
  '1': '#6B7280',
  '2': '#EF4444',
  '3': '#F97316',
  '4': '#F59E0B',
  '5': '#3B82F6',
  '6': '#10B981',
  '7': '#8B5CF6',
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
      <Pressable
        className="rounded-lg px-4 py-2 min-w-[80px] items-center active:opacity-70"
        style={{
          borderWidth: 1,
          borderColor: isSelected ? color : '#D1D5DB',
          backgroundColor: isSelected ? color : 'transparent',
        }}
        onPress={() => onStatusFilterChange?.(item.key)}
      >
        <Text
          className="font-medium text-sm"
          style={{ color: isSelected ? '#FFFFFF' : '#6B7280' }}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const renderWordItem = ({ item }: { item: Word }) => {
    const color = STATUS_COLORS[item.status];
    const label = STATUS_LABELS[item.status];

    return (
      <Pressable
        className="mb-3 active:opacity-80"
        onPress={() => onWordPress?.(item)}
      >
        <View
          className="p-4 rounded-xl bg-card shadow-sm"
          style={{ borderLeftWidth: 4, borderLeftColor: color }}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-semibold text-foreground flex-1">
              {item.word}
            </Text>
            <View
              className="px-2 py-1 rounded-lg"
              style={{ backgroundColor: color }}
            >
              <Text className="text-xs font-medium text-white">{label}</Text>
            </View>
          </View>

          <Text className="text-base mb-2 text-foreground opacity-80">
            {item.translation}
          </Text>

          {item.definition && (
            <Text
              className="text-sm mb-3 text-muted-foreground italic"
              numberOfLines={2}
            >
              {item.definition}
            </Text>
          )}

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-xs text-muted-foreground">Usage</Text>
              <Text className="text-base font-semibold text-foreground">
                {item.usageCount}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1">
      {/* Status filters */}
      <View className="py-4 border-b border-border">
        <FlatList
          data={statusFilters}
          renderItem={renderStatusFilter}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        />
      </View>

      {/* Word list */}
      <FlatList
        data={words}
        renderItem={renderWordItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-base text-muted-foreground">
              No words found for the selected filter.
            </Text>
          </View>
        }
      />
    </View>
  );
}
