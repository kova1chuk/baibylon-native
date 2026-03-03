import { createApi } from "@reduxjs/toolkit/query/react";

import { dictionaryApi } from "@/entities/dictionary/api/dictionaryApi";
import { dashboardApi } from "@/features/hub/api/dashboardApi";
import { nestBaseQuery } from "@/shared/api/nestBaseQuery";

import type { QueueItem, UserLearningPreferences, ErrorStatistics } from "./types";

interface NestResponse<T> {
  success: boolean;
  data: T;
}

export const learningQueueApi = createApi({
  reducerPath: "learningQueueApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["LearningQueue", "LearningPreferences", "ErrorStatistics"],
  endpoints: (builder) => ({
    getLearningQueue: builder.query<QueueItem[], { size?: number; focusLevel?: string }>({
      query: ({ size = 20, focusLevel }) => {
        const params = new URLSearchParams();
        params.set("size", String(size));
        if (focusLevel) params.set("focusLevel", focusLevel);
        return { url: `/learning-queue?${params.toString()}` };
      },
      providesTags: ["LearningQueue"],
      transformResponse: (response: QueueItem[]) => response || [],
    }),

    updateLearningState: builder.mutation<
      unknown,
      {
        metadataId: string;
        correct: boolean;
        quality?: number;
        newStage?: string;
      }
    >({
      query: ({ metadataId, correct, quality, newStage }) => ({
        url: "/learning-queue/result",
        method: "POST",
        body: { metadataId, correct, quality, newStage },
      }),
      invalidatesTags: ["LearningQueue"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(dictionaryApi.util.invalidateTags(["DictionaryStats", "Words"]));
        dispatch(dashboardApi.util.invalidateTags(["Dashboard"]));
      },
    }),

    recordError: builder.mutation<
      unknown,
      {
        errorPatternId: string;
        userInput: string;
        correction?: string;
        context?: string;
        messageId?: string;
      }
    >({
      query: ({ errorPatternId, userInput, correction, context, messageId }) => ({
        url: "/learning-queue/record-error",
        method: "POST",
        body: { errorPatternId, userInput, correction, context, messageId },
      }),
      invalidatesTags: ["LearningQueue", "ErrorStatistics"],
    }),

    getLearningPreferences: builder.query<UserLearningPreferences, void>({
      query: () => ({ url: "/learning-queue/preferences" }),
      providesTags: ["LearningPreferences"],
      transformResponse: (response: NestResponse<UserLearningPreferences>) => response.data,
    }),

    updateLearningPreferences: builder.mutation<
      UserLearningPreferences,
      Partial<UserLearningPreferences>
    >({
      query: (preferences) => ({
        url: "/learning-queue/preferences",
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: ["LearningPreferences", "LearningQueue"],
      transformResponse: (response: NestResponse<UserLearningPreferences>) => response.data,
    }),

    getErrorStatistics: builder.query<ErrorStatistics, void>({
      query: () => ({ url: "/learning-queue/error-statistics" }),
      providesTags: ["ErrorStatistics"],
      transformResponse: (response: NestResponse<ErrorStatistics>) => response.data,
    }),
  }),
});

export const {
  useGetLearningQueueQuery,
  useUpdateLearningStateMutation,
  useRecordErrorMutation,
  useGetLearningPreferencesQuery,
  useUpdateLearningPreferencesMutation,
  useGetErrorStatisticsQuery,
} = learningQueueApi;
