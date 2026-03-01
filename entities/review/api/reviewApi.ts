import { createApi } from '@reduxjs/toolkit/query/react';

import { dictionaryApi } from '@/entities/dictionary/api/dictionaryApi';
import { dashboardApi } from '@/features/hub/api/dashboardApi';
import { nestBaseQuery } from '@/shared/api/nestBaseQuery';

interface NestResponse<T> {
  success: boolean;
  data: T;
}

interface ReviewRow {
  id: string;
  title: string;
  document_link: string | null;
  sentence_cursor: number | null;
  sentences_count: number | null;
  total_words_count: number | null;
  unique_words_count: number | null;
  words_stat: Record<string, number> | null;
  created_at: string;
}

export interface Review {
  id: string;
  title: string;
  createdAt: string;
  userId: string;
  totalWords: number;
  uniqueWords: number;
  wordsStat: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, number>;
}

export type ReviewsForFilterResponse = { id: string; title: string }[];

function mapReviewRow(row: ReviewRow): Review {
  const wordsStat: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  };

  if (row.words_stat && typeof row.words_stat === 'object') {
    Object.keys(row.words_stat).forEach(key => {
      const status = Number(key);
      if (status >= 1 && status <= 7) {
        const count = Number(row.words_stat![status]);
        if (!isNaN(count) && count >= 0) {
          wordsStat[status as 1 | 2 | 3 | 4 | 5 | 6 | 7] = count;
        }
      }
    });
  }

  return {
    id: row.id,
    title: row.title || 'Untitled Review',
    createdAt: row.created_at || new Date().toISOString(),
    userId: '',
    totalWords: row.total_words_count || 0,
    uniqueWords: row.unique_words_count || 0,
    wordsStat,
  };
}

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: nestBaseQuery,
  tagTypes: ['Review'],
  endpoints: builder => ({
    getReviewsForFilter: builder.query<
      ReviewsForFilterResponse,
      { langCode: string }
    >({
      query: () => ({ url: '/reviews/filter' }),
      transformResponse: (response: NestResponse<ReviewsForFilterResponse>) =>
        response.data || [],
    }),
    getReviews: builder.query<
      { reviews: Review[]; hasMore: boolean; total: number },
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `/reviews?limit=${pageSize}&offset=${(page - 1) * pageSize}`,
      }),
      providesTags: ['Review'],
      transformResponse: (response: NestResponse<ReviewRow[]>, _meta, arg) => {
        const rows = response.data || [];
        const reviews = rows.map(mapReviewRow);
        const hasMore = reviews.length === (arg.pageSize ?? 10);
        return { reviews, hasMore, total: reviews.length };
      },
    }),
    saveReviewData: builder.mutation<
      void,
      {
        lang_code: string;
        title: string;
        word_entries: { text: string; usage_count: number }[];
        sentences: string[];
        document_link: string | null;
      }
    >({
      query: body => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Review'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dictionaryApi.util.invalidateTags(['DictionaryStats', 'Words'])
        );
        dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
      },
    }),
    deleteReview: builder.mutation<void, { reviewId: string }>({
      query: ({ reviewId }) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dictionaryApi.util.invalidateTags(['DictionaryStats', 'Words'])
        );
        dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
      },
    }),
  }),
});

export const {
  useGetReviewsForFilterQuery,
  useGetReviewsQuery,
  useDeleteReviewMutation,
} = reviewApi;
