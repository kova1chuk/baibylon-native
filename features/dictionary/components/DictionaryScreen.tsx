import React, { useState } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  YStack,
  XStack,
  Button,
  Spinner,
  ScrollView,
} from 'tamagui';

import { Alert } from 'react-native';

import { useDictionaryStats, useDictionaryWords } from '@/lib/api';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

import WordsList from './WordsList/WordsList';

import type { Word, WordStatus } from '@/lib/api/types';

export default function DictionaryScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const [selectedStatus, setSelectedStatus] = useState<WordStatus | 'all'>(
    'all'
  );
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Map WordStatus to API format
  const statusFilter: WordStatus[] | undefined =
    selectedStatus === 'all' ? undefined : [selectedStatus];

  const {
    data: wordsData,
    isLoading: wordsLoading,
    error: wordsError,
  } = useDictionaryWords({
    page,
    pageSize,
    statusFilter,
    langCode: 'en',
    translationLang: 'uk',
  });

  const { data: statsData } = useDictionaryStats('en');

  const words = wordsData?.words || [];

  const handleWordPress = (word: Word) => {
    Alert.alert(
      word.word,
      `Translation: ${word.translation}\n\nDefinition: ${word.definition}\n\nStatus: ${word.status}`,
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
    setPage(1); // Reset to first page when filter changes
  };

  const handleAddWord = () => {
    // TODO: Navigate to add word screen
    Alert.alert('Info', 'Add word functionality coming soon!');
  };

  const handleImportWords = () => {
    // TODO: Navigate to import words screen
    Alert.alert('Info', 'Import words functionality coming soon!');
  };

  // Calculate stats from API response
  const stats = {
    total: statsData?.totalWords || 0,
    notLearned: statsData?.wordStats?.['1'] || 0,
    beginner: statsData?.wordStats?.['2'] || 0,
    basic: statsData?.wordStats?.['3'] || 0,
    intermediate: statsData?.wordStats?.['4'] || 0,
    advanced: statsData?.wordStats?.['5'] || 0,
    wellKnown: statsData?.wordStats?.['6'] || 0,
    mastered: statsData?.wordStats?.['7'] || 0,
  };

  if (wordsLoading && !wordsData) {
    return (
      <View
        flex={1}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$background"
      >
        <Spinner size="large" />
      </View>
    );
  }

  if (wordsError) {
    return (
      <View
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$4"
        backgroundColor="$background"
      >
        <Text fontSize="$6" color="$red10" textAlign="center">
          Error loading words. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{
        paddingBottom: tabBarHeight + insets.bottom + 16,
        flexGrow: 1,
      }}
    >
      {/* Header */}
      <YStack
        gap="$4"
        padding="$6"
        margin="$4"
        backgroundColor="$background"
        borderRadius="$4"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={4}
      >
        <Text fontSize="$9" fontWeight="bold" color="$color">
          My Dictionary
        </Text>
        <Text fontSize="$4" opacity={0.7} lineHeight={22} color="$color">
          Track your vocabulary progress and manage your word collection
        </Text>

        {/* Action Buttons */}
        <XStack gap="$3">
          <Button
            flex={1}
            size="$4"
            backgroundColor="$blue10"
            color="white"
            fontWeight="600"
            onPress={handleAddWord}
          >
            + Add Word
          </Button>

          <Button
            flex={1}
            size="$4"
            borderColor="$borderColor"
            borderWidth={1}
            backgroundColor="transparent"
            color="$color"
            fontWeight="600"
            onPress={handleImportWords}
          >
            Import
          </Button>
        </XStack>
      </YStack>

      {/* Stats Overview */}
      <YStack
        gap="$4"
        padding="$5"
        margin="$4"
        backgroundColor="$background"
        borderRadius="$4"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={4}
      >
        <Text fontSize="$6" fontWeight="600" color="$color">
          Overview
        </Text>
        <XStack justifyContent="space-around">
          <YStack alignItems="center">
            <Text fontSize="$8" fontWeight="bold" color="$color">
              {stats.total}
            </Text>
            <Text fontSize="$3" opacity={0.7} textAlign="center" color="$color">
              Total Words
            </Text>
          </YStack>
          <YStack alignItems="center">
            <Text fontSize="$8" fontWeight="bold" color="$color">
              {stats.notLearned + stats.beginner + stats.basic}
            </Text>
            <Text fontSize="$3" opacity={0.7} textAlign="center" color="$color">
              Learning
            </Text>
          </YStack>
          <YStack alignItems="center">
            <Text fontSize="$8" fontWeight="bold" color="$color">
              {stats.intermediate + stats.advanced}
            </Text>
            <Text fontSize="$3" opacity={0.7} textAlign="center" color="$color">
              Practicing
            </Text>
          </YStack>
          <YStack alignItems="center">
            <Text fontSize="$8" fontWeight="bold" color="$color">
              {stats.wellKnown + stats.mastered}
            </Text>
            <Text fontSize="$3" opacity={0.7} textAlign="center" color="$color">
              Mastered
            </Text>
          </YStack>
        </XStack>
      </YStack>

      {/* Words List */}
      <WordsList
        words={words}
        onWordPress={handleWordPress}
        onStatusFilterChange={handleStatusFilterChange}
        selectedStatus={selectedStatus}
      />
    </ScrollView>
  );
}
