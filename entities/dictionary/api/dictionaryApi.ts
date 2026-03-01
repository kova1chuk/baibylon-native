import { createApi } from '@reduxjs/toolkit/query/react';

import { nestBaseQuery } from '@/shared/api/nestBaseQuery';

import type {
  GetDictStatsResponse,
  UserDictionaryStatsResponse,
  FetchWordsPageResponse,
  FetchWordsPageParams,
  DictionaryWordRow,
  QueueDictionaryWordRow,
  TrainingQueueRow,
  TrainingQueueParams,
  UnifiedQueueItem,
} from './types';

import type { WordStatus } from '@/shared/types';

function mapRowToWord(
  row: DictionaryWordRow | QueueDictionaryWordRow,
  arg: FetchWordsPageParams
) {
  return {
    id: row.word_id,
    word: row.text,
    definition: row.definition,
    translation: row.translation,
    example: undefined,
    status: parseInt(row.status) as WordStatus,
    userId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    phonetic: {
      text: row.phonetic_text,
      audio: row.phonetic_audio_link,
    },
    analysisIds: row.in_reviews ? arg.reviewIds : undefined,
    usageCount: row.usagecount,
    queueScore: 'queue_score' in row ? Number(row.queue_score) : undefined,
    masteryScore:
      'mastery_score' in row ? Number(row.mastery_score) : undefined,
  };
}

export const dictionaryApi = createApi({
  reducerPath: 'dictionaryApi',
  baseQuery: nestBaseQuery,
  tagTypes: ['DictionaryStats', 'Words', 'UnifiedQueue', 'GrammarProgress'],
  endpoints: builder => ({
    getDictStats: builder.query<
      UserDictionaryStatsResponse,
      { langCode: string }
    >({
      query: ({ langCode }) => ({
        url: '/dictionary/stats',
        params: { langCode },
      }),
      providesTags: ['DictionaryStats'],
      transformResponse: (response: GetDictStatsResponse) => ({
        totalWords: Object.values(response?.wordStats || {}).reduce(
          (sum, count) => sum + count,
          0
        ),
        wordStats: response?.wordStats || {},
        accuracy: response?.accuracy ?? 0,
      }),
    }),
    fetchWordsPage: builder.query<FetchWordsPageResponse, FetchWordsPageParams>(
      {
        query: ({
          page,
          pageSize,
          statusFilter = [],
          search = '',
          langCode = 'en',
          translationLang = 'uk',
          reviewIds,
          sortMode = 'recent',
          exerciseType,
        }) => ({
          url: '/dictionary/words',
          params: {
            langCode,
            translationLang,
            sortMode,
            limitCount: pageSize,
            offsetCount: (page - 1) * pageSize,
            searchText: search || undefined,
            statusFilter:
              statusFilter.length > 0 ? statusFilter.join(',') : undefined,
            reviewIds:
              reviewIds && reviewIds.length > 0
                ? reviewIds.join(',')
                : undefined,
            exerciseType: exerciseType || undefined,
          },
        }),
        providesTags: (_result, _error, arg) => {
          return [
            {
              type: 'Words',
              id: `${arg.sortMode ?? 'recent'}-${arg.exerciseType ?? 'all'}-${arg.page}`,
            },
          ];
        },
        transformResponse: (
          response: DictionaryWordRow[] | QueueDictionaryWordRow[],
          _meta,
          arg: FetchWordsPageParams
        ) => {
          const rows = response || [];
          const totalWords = rows.length > 0 ? Number(rows[0].total_count) : 0;
          const words = rows.map(row => mapRowToWord(row, arg));
          return {
            words,
            totalWords,
            page: arg.page,
            hasMore: arg.page * arg.pageSize < totalWords,
          };
        },
      }
    ),
    getTrainingQueue: builder.query<
      FetchWordsPageResponse,
      TrainingQueueParams
    >({
      query: ({ trainingType, limit = 200, statusFilter, reviewIds }) => ({
        url: '/dictionary/words/training-queue',
        params: {
          trainingType,
          limit,
          statusFilter:
            statusFilter && statusFilter.length > 0
              ? statusFilter.map(String).join(',')
              : undefined,
          reviewIds:
            reviewIds && reviewIds.length > 0 ? reviewIds.join(',') : undefined,
        },
      }),
      providesTags: (_result, _error, arg) => [
        { type: 'Words', id: `training-queue-${arg.trainingType}` },
      ],
      transformResponse: (
        response: TrainingQueueRow[],
        _meta,
        _arg: TrainingQueueParams
      ) => {
        const rows = response || [];
        const words = rows.map(row => ({
          id: row.word_id,
          word: row.text,
          definition: row.definition,
          translation: row.translation,
          example: undefined,
          status: parseInt(row.status) as WordStatus,
          userId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          phonetic: {
            text: row.phonetic_text,
            audio: row.phonetic_audio_link,
          },
          usageCount: undefined,
          queueScore: Number(row.priority),
          masteryScore: Number(row.mastery_score),
        }));
        return {
          words,
          totalWords: words.length,
          page: 1,
          hasMore: false,
        };
      },
    }),
    getRandomWord: builder.query<
      DictionaryWordRow | null,
      { langCode?: string; translationLang?: string; _timestamp?: number }
    >({
      query: ({ langCode = 'en', translationLang = 'uk' }) => ({
        url: '/dictionary/words/random',
        params: { langCode, translationLang },
      }),
      transformResponse: (response: DictionaryWordRow[]) => {
        return response && response.length > 0 ? response[0] : null;
      },
      keepUnusedDataFor: 0,
    }),
    getUnifiedQueue: builder.query<
      UnifiedQueueItem[],
      { size?: number; focusLevel?: string }
    >({
      query: params => ({
        url: '/learning-queue',
        params,
      }),
      providesTags: ['UnifiedQueue'],
    }),
    submitLearningResult: builder.mutation<
      unknown,
      {
        metadataId: string;
        correct: boolean;
        quality?: number;
        newStage?: string;
      }
    >({
      query: body => ({
        url: '/learning-queue/result',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UnifiedQueue'],
    }),
    submitWordSessionStepResult: builder.mutation<
      {
        success: boolean;
        data: {
          masteryBefore: number;
          masteryAfter: number;
          statusBefore: number;
          statusAfter: number;
        };
      },
      {
        wordId: string;
        exerciseType: string;
        correct: boolean;
        userInput?: string;
        correctAnswer?: string;
        context?: string;
      }
    >({
      query: body => ({
        url: '/learning-queue/word-session/step-result',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Words'],
    }),
    addNewWord: builder.mutation<
      string,
      { langCode: string; wordText: string; wordId?: string }
    >({
      query: ({ langCode, wordText, wordId }) => ({
        url: '/dictionary/words',
        method: 'POST',
        body: { langCode, wordText, wordId },
      }),
      invalidatesTags: ['DictionaryStats', 'Words'],
    }),
    submitGrammarQuizStepResult: builder.mutation<
      {
        ruleProgress: {
          practiceCount: number;
          correctCount: number;
          understood: boolean;
        };
        mistakeId?: string;
      },
      {
        ruleId: string;
        correct: boolean;
        userAnswer: string;
        correctAnswer: string;
        questionText: string;
        topicId?: string;
      }
    >({
      query: body => ({
        url: '/grammar/quiz/step-result',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['GrammarProgress'],
    }),
  }),
});

export const {
  useGetDictStatsQuery,
  useFetchWordsPageQuery,
  useGetTrainingQueueQuery,
  useGetUnifiedQueueQuery,
  useSubmitLearningResultMutation,
  useSubmitWordSessionStepResultMutation,
  useGetRandomWordQuery,
  useAddNewWordMutation,
  useSubmitGrammarQuizStepResultMutation,
} = dictionaryApi;
