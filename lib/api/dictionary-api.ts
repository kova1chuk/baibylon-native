import { useQuery } from '@tanstack/react-query';

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

export const dictionaryKeys = {
  all: ['dictionary'] as const,
  stats: (langCode: string) =>
    [...dictionaryKeys.all, 'stats', langCode] as const,
  words: (params: FetchWordsPageParams) =>
    [...dictionaryKeys.all, 'words', params] as const,
  randomWord: (langCode?: string, translationLang?: string) =>
    [...dictionaryKeys.all, 'randomWord', langCode, translationLang] as const,
};

export function useDictionaryStats(langCode: string) {
  return useQuery({
    queryKey: dictionaryKeys.stats(langCode),
    queryFn: async (): Promise<UserDictionaryStatsResponse> => {
      const response = await supabaseRpcQuery<GetDictStatsResponse>({
        functionName: 'get_dict_stat',
        args: { p_lang_code: langCode },
      });

      return {
        totalWords: Object.values(response || {}).reduce(
          (sum, count) => sum + count,
          0
        ),
        wordStats: response || {},
      };
    },
  });
}

export function useDictionaryWords(params: FetchWordsPageParams) {
  return useQuery({
    queryKey: dictionaryKeys.words(params),
    queryFn: async (): Promise<FetchWordsPageResponse> => {
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

      return {
        words,
        totalWords,
        page,
        hasMore: page * pageSize < totalWords,
      };
    },
  });
}

export function useRandomWord(
  langCode: string = 'en',
  translationLang: string = 'uk'
) {
  return useQuery({
    queryKey: dictionaryKeys.randomWord(langCode, translationLang),
    queryFn: async (): Promise<DictionaryWordRow | null> => {
      const response = await supabaseRpcQuery<DictionaryWordRow[]>({
        functionName: 'get_random_word',
        args: {
          p_lang_code: langCode,
          p_translation_lang: translationLang,
        },
      });

      return response && response.length > 0 ? response[0] : null;
    },
  });
}
