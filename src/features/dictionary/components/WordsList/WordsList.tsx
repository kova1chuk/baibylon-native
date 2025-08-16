import React from 'react';

import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useColorScheme } from '@/hooks/useColorScheme';

import { colors } from '../../../../shared/config/colors';
import { Word, WordStatus } from '../../../../shared/types';

interface WordsListProps {
  words: Word[];
  onWordPress?: (word: Word) => void;
  onStatusFilterChange?: (status: WordStatus | 'all') => void;
  selectedStatus?: WordStatus | 'all';
}

export default function WordsList({
  words,
  onWordPress,
  onStatusFilterChange,
  selectedStatus = 'all',
}: WordsListProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = colors;

  const statusFilters: { key: WordStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'notLearned', label: 'Not Learned' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'basic', label: 'Basic' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
    { key: 'wellKnown', label: 'Well Known' },
    { key: 'mastered', label: 'Mastered' },
  ];

  const getStatusColor = (status: WordStatus | 'all') => {
    return themeColors.statusFilters[status] || themeColors.statusFilters.all;
  };

  const renderStatusFilter = ({
    item,
  }: {
    item: { key: WordStatus | 'all'; label: string };
  }) => {
    const isSelected = selectedStatus === item.key;
    const statusColors = getStatusColor(item.key);

    return (
      <TouchableOpacity
        style={[
          styles.statusFilter,
          {
            borderColor: statusColors.border,
            backgroundColor: isSelected
              ? statusColors.activeBg
              : statusColors.bg,
          },
        ]}
        onPress={() => onStatusFilterChange?.(item.key)}
        activeOpacity={0.7}
      >
        <ThemedText
          style={[
            styles.statusFilterText,
            {
              color: statusColors.text,
            },
          ]}
        >
          {item.label}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const renderWordItem = ({ item }: { item: Word }) => {
    const statusColors = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={[
          styles.wordItem,
          {
            backgroundColor: isDark
              ? themeColors.background.card.dark
              : themeColors.background.card.light,
            borderLeftColor: statusColors.accent,
          },
        ]}
        onPress={() => onWordPress?.(item)}
        activeOpacity={0.7}
      >
        <View style={styles.wordHeader}>
          <ThemedText type="subtitle" style={styles.wordText}>
            {item.text}
          </ThemedText>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
          >
            <ThemedText
              style={[styles.statusText, { color: statusColors.text }]}
            >
              {item.status}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.translationText}>
          {item.translation}
        </ThemedText>

        {item.context && (
          <ThemedText style={styles.contextText} numberOfLines={2}>
            Context: {item.context}
          </ThemedText>
        )}

        <View style={styles.wordStats}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Difficulty:</ThemedText>
            <ThemedText style={styles.statValue}>{item.difficulty}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Reviews:</ThemedText>
            <ThemedText style={styles.statValue}>{item.reviewCount}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Accuracy:</ThemedText>
            <ThemedText style={styles.statValue}>
              {item.totalAnswers > 0
                ? Math.round((item.correctAnswers / item.totalAnswers) * 100)
                : 0}
              %
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredWords =
    selectedStatus === 'all'
      ? words
      : words.filter(word => word.status === selectedStatus);

  return (
    <ThemedView style={styles.container}>
      {/* Status Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={statusFilters}
          renderItem={renderStatusFilter}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Words List */}
      <FlatList
        data={filteredWords}
        renderItem={renderWordItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wordsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No words found for the selected filter.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  statusFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  statusFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  wordsList: {
    padding: 16,
  },
  wordItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  translationText: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.8,
  },
  contextText: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  wordStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
