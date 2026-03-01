import { createApi } from '@reduxjs/toolkit/query/react';

import { nestBaseQuery } from '@/shared/api/nestBaseQuery';

import type {
  GrammarLevelRow,
  GrammarCategoryRow,
  GrammarTopicRow,
  TopicContentData,
} from './types';

interface NestResponse<T> {
  success: boolean;
  data: T;
}

export const grammarApi = createApi({
  reducerPath: 'grammarApi',
  baseQuery: nestBaseQuery,
  tagTypes: [
    'GrammarLevels',
    'GrammarCategories',
    'GrammarTopics',
    'GrammarTopicContent',
  ],
  endpoints: builder => ({
    getGrammarLevels: builder.query<GrammarLevelRow[], void>({
      query: () => ({ url: '/grammar/levels' }),
      providesTags: ['GrammarLevels'],
      transformResponse: (response: NestResponse<GrammarLevelRow[]>) =>
        response.data || [],
    }),

    getLevelCategories: builder.query<
      GrammarCategoryRow[],
      { levelId: string }
    >({
      query: ({ levelId }) => ({
        url: `/grammar/levels/${levelId}/categories`,
      }),
      providesTags: (_result, _error, arg) => [
        { type: 'GrammarCategories', id: arg.levelId },
      ],
      transformResponse: (response: NestResponse<GrammarCategoryRow[]>) =>
        response.data || [],
    }),

    getCategoryTopics: builder.query<GrammarTopicRow[], { categoryId: string }>(
      {
        query: ({ categoryId }) => ({
          url: `/grammar/categories/${categoryId}/topics`,
        }),
        providesTags: (_result, _error, arg) => [
          { type: 'GrammarTopics', id: arg.categoryId },
        ],
        transformResponse: (response: NestResponse<GrammarTopicRow[]>) =>
          response.data || [],
      }
    ),

    getTopicContent: builder.query<TopicContentData, { topicId: string }>({
      query: ({ topicId }) => ({
        url: `/grammar/topics/${topicId}/content`,
      }),
      providesTags: (_result, _error, arg) => [
        { type: 'GrammarTopicContent', id: arg.topicId },
      ],
      transformResponse: (response: NestResponse<TopicContentData>) =>
        response.data,
    }),

    updateTopicProgress: builder.mutation<
      unknown,
      { topicId: string; status: string; masteryScore?: number }
    >({
      query: ({ topicId, status, masteryScore }) => ({
        url: `/grammar/topics/${topicId}/progress`,
        method: 'PATCH',
        body: { status, masteryScore },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'GrammarTopicContent', id: arg.topicId },
        'GrammarTopics',
        'GrammarLevels',
      ],
    }),

    updateRuleProgress: builder.mutation<
      unknown,
      { ruleId: string; understood: boolean; quality?: number }
    >({
      query: ({ ruleId, understood, quality }) => ({
        url: `/grammar/rules/${ruleId}/progress`,
        method: 'PATCH',
        body: { understood, quality },
      }),
      invalidatesTags: ['GrammarTopicContent', 'GrammarTopics'],
    }),
  }),
});

export const {
  useGetGrammarLevelsQuery,
  useGetLevelCategoriesQuery,
  useGetCategoryTopicsQuery,
  useGetTopicContentQuery,
  useUpdateTopicProgressMutation,
  useUpdateRuleProgressMutation,
} = grammarApi;
