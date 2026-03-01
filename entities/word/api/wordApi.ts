import { createApi } from '@reduxjs/toolkit/query/react';

import { nestBaseQuery } from '@/shared/api/nestBaseQuery';
import { WordStatus } from '@/shared/types';

import type { WordNlpDataDto } from '@/shared/types/openapi';

export type WordNlpData = WordNlpDataDto;

export interface WordTrainingMistake {
  exercise_type: string;
  user_input: string;
  correct_answer: string;
  context?: string | null;
  created_at: string;
}

export interface WordTrainingEvent {
  training_type: string;
  result: string;
  quality: number;
  skill_before?: number | null;
  skill_after?: number | null;
  global_skill_before?: number | null;
  global_skill_after?: number | null;
  user_answer?: string | null;
  correct_answer?: string | null;
  created_at: string;
}

export interface WordTrainingHistoryItem extends WordTrainingEvent {
  id: string;
}

export interface GlobalTrainingHistoryItem extends WordTrainingHistoryItem {
  word_id: string;
  word_text: string;
}

export interface WordTrainingStats {
  global_skill: number;
  total_seen: number;
  total_success: number;
  success_streak: number;
  fail_streak: number;
  next_due_at?: string | null;
  recent_events: WordTrainingEvent[];
  recent_mistakes: WordTrainingMistake[];
}

export const wordApi = createApi({
  reducerPath: 'wordApi',
  baseQuery: nestBaseQuery,
  tagTypes: ['Word'],
  endpoints: builder => ({
    reloadWord: builder.mutation<
      { definition: string; translatedText: string },
      { langCode: string; id: string }
    >({
      query: ({ langCode, id }) => ({
        url: `/dictionary/words/${id}/reload`,
        method: 'POST',
        body: { langCode },
      }),
      invalidatesTags: ['Word'],
    }),

    updateWordStatus: builder.mutation<
      void,
      {
        langCode: string;
        id: string;
        newStatus: WordStatus;
      }
    >({
      query: ({ langCode, id, newStatus }) => ({
        url: `/dictionary/words/${id}/status`,
        method: 'PATCH',
        body: { langCode, newStatus },
      }),
      invalidatesTags: ['Word'],
    }),

    removeWordFromDictionary: builder.mutation<
      void,
      {
        langCode: string;
        id: string;
      }
    >({
      query: ({ langCode, id }) => ({
        url: `/dictionary/words/${id}`,
        method: 'DELETE',
        params: { langCode },
      }),
      invalidatesTags: ['Word'],
    }),

    getWordNlpData: builder.query<WordNlpData | null, { wordText: string }>({
      query: ({ wordText }) => ({
        url: `/dictionary/words/${encodeURIComponent(wordText)}/nlp`,
      }),
      transformResponse: (response: WordNlpData[]) => {
        return response && response.length > 0 ? response[0] : null;
      },
    }),

    startTrainingSession: builder.mutation<string, { exerciseType?: string }>({
      query: ({ exerciseType = 'flashcard' }) => ({
        url: '/dictionary/training/sessions',
        method: 'POST',
        body: { exerciseType },
      }),
    }),

    recordTrainingResult: builder.mutation<
      {
        skill_before: number;
        skill_after: number;
        global_skill_before: number;
        global_skill_after: number;
        mastery_score: number;
        next_due_at: string;
        cooldown_until: string;
        streak: number;
        seen_count: number;
      },
      {
        wordId: string;
        trainingType: string;
        result: string;
        quality: number;
        sessionId?: string;
        userAnswer?: string;
        correctAnswer?: string;
      }
    >({
      query: ({
        wordId,
        trainingType,
        result,
        quality,
        sessionId,
        userAnswer,
        correctAnswer,
      }) => ({
        url: '/dictionary/training/result',
        method: 'POST',
        body: {
          wordId,
          trainingType,
          result,
          quality,
          ...(sessionId ? { sessionId } : {}),
          ...(userAnswer != null ? { userAnswer } : {}),
          ...(correctAnswer != null ? { correctAnswer } : {}),
        },
      }),
      invalidatesTags: ['Word'],
    }),

    completeTrainingSession: builder.mutation<void, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/dictionary/training/sessions/${sessionId}/complete`,
        method: 'POST',
      }),
    }),

    getWordTrainingStats: builder.query<WordTrainingStats, { wordId: string }>({
      query: ({ wordId }) => ({
        url: `/dictionary/words/${wordId}/training-stats`,
      }),
      providesTags: ['Word'],
    }),

    getWordTrainingHistory: builder.query<
      WordTrainingHistoryItem[],
      { wordId: string; limit?: number; offset?: number }
    >({
      query: ({ wordId, limit = 50, offset = 0 }) => ({
        url: `/dictionary/words/${wordId}/training-history`,
        params: { limit, offset },
      }),
      providesTags: ['Word'],
    }),

    getGlobalTrainingHistory: builder.query<
      GlobalTrainingHistoryItem[],
      { limit?: number; offset?: number }
    >({
      query: ({ limit = 50, offset = 0 }) => ({
        url: `/dictionary/training/history`,
        params: { limit, offset },
      }),
      providesTags: ['Word'],
    }),
  }),
});

export const {
  useUpdateWordStatusMutation,
  useReloadWordMutation,
  useRemoveWordFromDictionaryMutation,
  useGetWordNlpDataQuery,
  useStartTrainingSessionMutation,
  useRecordTrainingResultMutation,
  useCompleteTrainingSessionMutation,
  useGetWordTrainingStatsQuery,
  useGetWordTrainingHistoryQuery,
  useGetGlobalTrainingHistoryQuery,
} = wordApi;
