import React, { useState } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';

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
            Alert.alert('Info', 'Training functionality coming soon!');
          },
        },
      ]
    );
  };

  const handleStatusFilterChange = (status: WordStatus | 'all') => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleAddWord = () => {
    Alert.alert('Info', 'Add word functionality coming soon!');
  };

  const handleImportWords = () => {
    Alert.alert('Info', 'Import words functionality coming soon!');
  };

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
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (wordsError) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-background">
        <Text className="text-xl text-destructive text-center">
          Error loading words. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: tabBarHeight + insets.bottom + 16,
        flexGrow: 1,
      }}
    >
      {/* Header card */}
      <View className="gap-4 p-6 m-4 bg-card rounded-2xl shadow-sm">
        <Text className="text-3xl font-bold text-foreground">
          My Dictionary
        </Text>
        <Text className="text-base text-muted-foreground leading-[22px]">
          Track your vocabulary progress and manage your word collection
        </Text>

        <View className="flex-row gap-3">
          <Pressable
            className="flex-1 bg-primary rounded-xl py-3 items-center active:opacity-80"
            onPress={handleAddWord}
          >
            <Text className="text-white font-semibold">+ Add Word</Text>
          </Pressable>

          <Pressable
            className="flex-1 border border-border rounded-xl py-3 items-center active:opacity-80"
            onPress={handleImportWords}
          >
            <Text className="text-foreground font-semibold">Import</Text>
          </Pressable>
        </View>
      </View>

      {/* Overview card */}
      <View className="gap-4 p-5 m-4 bg-card rounded-2xl shadow-sm">
        <Text className="text-xl font-semibold text-foreground">Overview</Text>
        <View className="flex-row justify-around">
          {[
            { label: 'Total Words', value: stats.total },
            {
              label: 'Learning',
              value: stats.notLearned + stats.beginner + stats.basic,
            },
            { label: 'Practicing', value: stats.intermediate + stats.advanced },
            { label: 'Mastered', value: stats.wellKnown + stats.mastered },
          ].map(item => (
            <View key={item.label} className="items-center">
              <Text className="text-2xl font-bold text-foreground">
                {item.value}
              </Text>
              <Text className="text-sm text-muted-foreground text-center">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Words list */}
      <WordsList
        words={words}
        onWordPress={handleWordPress}
        onStatusFilterChange={handleStatusFilterChange}
        selectedStatus={selectedStatus}
      />
    </ScrollView>
  );
}
