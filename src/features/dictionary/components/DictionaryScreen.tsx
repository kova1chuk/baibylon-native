import React, { useState } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useColorScheme } from '@/hooks/useColorScheme';

import { colors } from '../../../shared/config/colors';
import { Word, WordStatus } from '../../../shared/types';

import WordsList from './WordsList/WordsList';

export default function DictionaryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = colors;

  const [selectedStatus, setSelectedStatus] = useState<WordStatus | 'all'>(
    'all'
  );

  // Mock words data - in real app this would come from API/context
  const [words] = useState<Word[]>([
    {
      id: '1',
      text: 'serendipity',
      translation: 'a pleasant surprise',
      difficulty: 'advanced',
      status: 'notLearned',
      context: 'Finding that book was pure serendipity.',
      examples: ['The meeting was a serendipitous encounter.'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      lastReviewed: undefined,
      reviewCount: 0,
      correctAnswers: 0,
      totalAnswers: 0,
    },
    {
      id: '2',
      text: 'ephemeral',
      translation: 'lasting for a very short time',
      difficulty: 'intermediate',
      status: 'beginner',
      context: 'The beauty of cherry blossoms is ephemeral.',
      examples: ['Fame can be ephemeral in the entertainment industry.'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      lastReviewed: '2024-01-01T00:00:00Z',
      reviewCount: 1,
      correctAnswers: 1,
      totalAnswers: 1,
    },
    {
      id: '3',
      text: 'ubiquitous',
      translation: 'present everywhere',
      difficulty: 'intermediate',
      status: 'basic',
      context: 'Smartphones have become ubiquitous in modern society.',
      examples: ['Coffee shops are ubiquitous in this neighborhood.'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      lastReviewed: '2024-01-01T00:00:00Z',
      reviewCount: 2,
      correctAnswers: 2,
      totalAnswers: 2,
    },
    {
      id: '4',
      text: 'mellifluous',
      translation: 'sweet or musical; pleasant to hear',
      difficulty: 'advanced',
      status: 'intermediate',
      context: 'Her mellifluous voice captivated the audience.',
      examples: ['The mellifluous tones of the violin filled the room.'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      lastReviewed: '2024-01-01T00:00:00Z',
      reviewCount: 3,
      correctAnswers: 2,
      totalAnswers: 3,
    },
    {
      id: '5',
      text: 'perspicacious',
      translation: 'having a ready insight into and understanding of things',
      difficulty: 'advanced',
      status: 'wellKnown',
      context: 'His perspicacious analysis revealed the underlying issue.',
      examples: ['She is known for her perspicacious observations.'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      lastReviewed: '2024-01-01T00:00:00Z',
      reviewCount: 5,
      correctAnswers: 5,
      totalAnswers: 5,
    },
  ]);

  const handleWordPress = (word: Word) => {
    Alert.alert(
      word.text,
      `Translation: ${word.translation}\n\nContext: ${word.context}\n\nDifficulty: ${word.difficulty}\nStatus: ${word.status}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Start Training',
          onPress: () => {
            // TODO: Navigate to training with this word
            Alert.alert('Info', 'Training functionality coming soon!');
          },
        },
      ]
    );
  };

  const handleStatusFilterChange = (status: WordStatus | 'all') => {
    setSelectedStatus(status);
  };

  const handleAddWord = () => {
    // TODO: Navigate to add word screen
    Alert.alert('Info', 'Add word functionality coming soon!');
  };

  const handleImportWords = () => {
    // TODO: Navigate to import words screen
    Alert.alert('Info', 'Import words functionality coming soon!');
  };

  const filteredWords =
    selectedStatus === 'all'
      ? words
      : words.filter(word => word.status === selectedStatus);

  const getStats = () => {
    const total = words.length;
    const notLearned = words.filter(w => w.status === 'notLearned').length;
    const beginner = words.filter(w => w.status === 'beginner').length;
    const basic = words.filter(w => w.status === 'basic').length;
    const intermediate = words.filter(w => w.status === 'intermediate').length;
    const advanced = words.filter(w => w.status === 'advanced').length;
    const wellKnown = words.filter(w => w.status === 'wellKnown').length;
    const mastered = words.filter(w => w.status === 'mastered').length;

    return {
      total,
      notLearned,
      beginner,
      basic,
      intermediate,
      advanced,
      wellKnown,
      mastered,
    };
  };

  const stats = getStats();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? themeColors.background.page.dark
            : themeColors.background.page.light,
        },
      ]}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: isDark
                ? themeColors.background.card.dark
                : themeColors.background.card.light,
            },
          ]}
        >
          <ThemedText type="title" style={styles.title}>
            My Dictionary
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Track your vocabulary progress and manage your word collection
          </ThemedText>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: themeColors.button.primary.background },
              ]}
              onPress={handleAddWord}
            >
              <ThemedText
                style={[
                  styles.actionButtonText,
                  { color: themeColors.button.primary.text },
                ]}
              >
                + Add Word
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  borderColor: isDark
                    ? themeColors.border.dark
                    : themeColors.border.light,
                },
              ]}
              onPress={handleImportWords}
            >
              <ThemedText style={styles.secondaryActionButtonText}>
                Import
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View
          style={[
            styles.statsOverview,
            {
              backgroundColor: isDark
                ? themeColors.background.card.dark
                : themeColors.background.card.light,
            },
          ]}
        >
          <ThemedText type="subtitle" style={styles.statsTitle}>
            Overview
          </ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stats.total}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Words</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {stats.notLearned + stats.beginner + stats.basic}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Learning</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {stats.intermediate + stats.advanced}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Practicing</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {stats.wellKnown + stats.mastered}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Mastered</ThemedText>
            </View>
          </View>
        </View>

        {/* Words List */}
        <WordsList
          words={filteredWords}
          onWordPress={handleWordPress}
          onStatusFilterChange={handleStatusFilterChange}
          selectedStatus={selectedStatus}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  statsOverview: {
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
});
