import React, { useCallback, useState } from 'react';

import { Plus, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import {
  useGetDictStatsQuery,
  useFetchWordsPageQuery,
  useAddNewWordMutation,
} from '@/entities/dictionary/api/dictionaryApi';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

import WordsList from './WordsList/WordsList';

import type { WordStatus } from '@/shared/types';

const PAGE_SIZE = 20;

export default function DictionaryScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabOverflow();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedStatus, setSelectedStatus] = useState<WordStatus | 'all'>(
    'all'
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [addingWord, setAddingWord] = useState(false);
  const [newWordText, setNewWordText] = useState('');

  const statusFilter: number[] | undefined =
    selectedStatus === 'all' ? undefined : [selectedStatus];

  const {
    data: wordsData,
    isLoading: wordsLoading,
    isFetching,
  } = useFetchWordsPageQuery({
    page,
    pageSize: PAGE_SIZE,
    statusFilter,
    search: search || undefined,
    langCode: 'en',
    translationLang: 'uk',
  });

  const { data: statsData } = useGetDictStatsQuery({ langCode: 'en' });
  const [addNewWord, { isLoading: isAddingWord }] = useAddNewWordMutation();

  const words = wordsData?.words || [];
  const totalWords = wordsData?.totalWords || 0;
  const hasMore = wordsData?.hasMore || false;

  const handleStatusFilterChange = useCallback((status: WordStatus | 'all') => {
    setSelectedStatus(status);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching]);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    setPage(1);
  }, []);

  const handleAddWord = useCallback(async () => {
    if (!newWordText.trim()) return;
    try {
      await addNewWord({
        langCode: 'en',
        wordText: newWordText.trim(),
      }).unwrap();
      setNewWordText('');
      setAddingWord(false);
    } catch {}
  }, [newWordText, addNewWord]);

  const stats = {
    total: statsData?.totalWords || 0,
    accuracy: statsData?.accuracy || 0,
  };

  if (wordsLoading && !wordsData) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 8 }}
    >
      {/* Header */}
      <View className="px-4 pb-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('dictionary.title')}
          </Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-xs text-muted-foreground">
              {stats.total} {t('common.items')}
            </Text>
            <Pressable
              onPress={() => setAddingWord(!addingWord)}
              className="p-2 active:opacity-50"
            >
              <Plus size={20} color={isDark ? '#6EE7B7' : '#10B981'} />
            </Pressable>
          </View>
        </View>

        {/* Add word input */}
        {addingWord && (
          <View className="flex-row gap-2 mb-3">
            <TextInput
              className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-foreground"
              placeholder={t('dictionary.searchPlaceholder')}
              placeholderTextColor={isDark ? '#71717A' : '#A1A1AA'}
              value={newWordText}
              onChangeText={setNewWordText}
              autoFocus
              onSubmitEditing={handleAddWord}
            />
            <Pressable
              className="bg-primary rounded-xl px-4 py-2 items-center justify-center active:opacity-80"
              onPress={handleAddWord}
              disabled={isAddingWord || !newWordText.trim()}
              style={{
                opacity: isAddingWord || !newWordText.trim() ? 0.5 : 1,
              }}
            >
              <Text className="text-white font-semibold text-sm">
                {t('dictionary.addBtn')}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Search */}
        <View className="flex-row items-center bg-card border border-border rounded-xl px-3 py-2">
          <Search size={16} color={isDark ? '#71717A' : '#A1A1AA'} />
          <TextInput
            className="flex-1 ml-2 text-foreground text-sm"
            placeholder={t('dictionary.searchPlaceholder')}
            placeholderTextColor={isDark ? '#71717A' : '#A1A1AA'}
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Words list with filters */}
      <WordsList
        words={words}
        totalWords={totalWords}
        hasMore={hasMore}
        isFetching={isFetching}
        onStatusFilterChange={handleStatusFilterChange}
        selectedStatus={selectedStatus}
        onLoadMore={handleLoadMore}
        contentPaddingBottom={tabBarHeight + 20}
      />
    </View>
  );
}
