import { useState, useEffect, useCallback } from 'react';

import { supabaseRpcQuery } from './supabase-rpc';
import type {
  DictionaryWordRow,
  FetchWordsPageParams,
  FetchWordsPageResponse,
  GetDictStatsResponse,
  UserDictionaryStatsResponse,
  Word,
  WordStatus,
} from './types';

export function useDictionaryStats(langCode: string) {
  const [data, setData] = useState<UserDictionaryStatsResponse | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await supabaseRpcQuery<GetDictStatsResponse>({
        functionName: 'get_dict_stat',
        args: { p_lang_code: langCode },
      });
      setData({
        totalWords: Object.values(response || {}).reduce(
          (sum, count) => sum + count,
          0
        ),
        wordStats: response || {},
      });
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [langCode]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useDictionaryWords(params: FetchWordsPageParams) {
  const [data, setData] = useState<FetchWordsPageResponse | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        page,
        pageSize,
        statusFilter = [],
        search = '',
        langCode = 'en',
        translationLang = 'uk',
        reviewIds,
      } = params;

      const response = await supabaseRpcQuery<DictionaryWordRow[]>({
        functionName: 'get_dictionary_words',
        args: {
          lang_code: langCode,
          translation_lang: translationLang,
          review_ids: reviewIds || null,
          search_text: search || null,
          status_filter: statusFilter.length > 0 ? statusFilter : null,
          limit_count: pageSize,
          offset_count: (page - 1) * pageSize,
          sort_order: 'desc',
          sort_by_usage_count: 'desc',
        },
      });

      const rows = response || [];
      const totalWords = rows.length > 0 ? Number(rows[0].total_count) : 0;

      const words: Word[] = rows.map(row => ({
        id: row.word_id,
        word: row.text,
        definition: row.definition,
        translation: row.translation,
        example: undefined,
        status: row.status as WordStatus,
        userId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        phonetic: {
          text: row.phonetic_text,
          audio: row.phonetic_audio_link,
        },
        analysisIds: row.in_reviews ? reviewIds : undefined,
        usageCount: row.usagecount,
      }));

      setData({
        words,
        totalWords,
        page,
        hasMore: page * pageSize < totalWords,
      });
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [
    params.page,
    params.pageSize,
    params.langCode,
    params.translationLang,
    params.search,
    JSON.stringify(params.statusFilter),
  ]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useRandomWord(
  langCode: string = 'en',
  translationLang: string = 'uk'
) {
  const [data, setData] = useState<DictionaryWordRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await supabaseRpcQuery<DictionaryWordRow[]>({
        functionName: 'get_random_word',
        args: {
          p_lang_code: langCode,
          p_translation_lang: translationLang,
        },
      });
      setData(response && response.length > 0 ? response[0] : null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [langCode, translationLang]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
