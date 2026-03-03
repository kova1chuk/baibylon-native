import { createApi } from "@reduxjs/toolkit/query/react";

import { nestBaseQuery } from "./nestBaseQuery";

export interface TutorSessionRecord {
  id: string;
  userId: string;
  mode: string;
  topic: string | null;
  startedAt: string;
  endedAt: string | null;
  messageCount: number;
  quizTotal: number;
  quizCorrect: number;
  accuracy: number | null;
  streak: number;
  wordsPracticed: string[];
  grammarErrors: string[];
}

export interface WeeklyStats {
  totalSessions: number;
  totalMessages: number;
  totalQuizzes: number;
  quizCorrect: number;
  avgAccuracy: number;
  totalTimeMinutes: number;
  activeDays: number;
}

export interface ProfileStats {
  totalSessions: number;
  totalMessages: number;
  totalQuizzes: number;
  quizCorrect: number;
  avgAccuracy: number;
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
}

interface SessionResponse {
  success: boolean;
  data: TutorSessionRecord;
}

interface SessionListResponse {
  success: boolean;
  data: TutorSessionRecord[];
}

interface StartSessionResponse {
  success: boolean;
  data: { sessionId: string };
}

interface StatsResponse<T> {
  success: boolean;
  data: T;
}

export interface TutorPreferences {
  enableSuggestions: boolean;
  autoCorrect: boolean;
  showTranslations: boolean;
  difficulty: string;
  sessionLength: number;
  correctionLevel: string;
  responseLanguage: string;
}

export const tutorApi = createApi({
  reducerPath: "tutorApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["TutorSession", "TutorStats", "TutorPreferences"],
  endpoints: (builder) => ({
    getTutorSessions: builder.query<TutorSessionRecord[], { limit?: number }>({
      query: ({ limit = 20 }) => ({
        url: `/tutor/sessions?limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: SessionListResponse) => response.data,
      providesTags: ["TutorSession"],
    }),

    getTutorSession: builder.query<TutorSessionRecord, string>({
      query: (sessionId) => ({
        url: `/tutor/sessions/${sessionId}`,
        method: "GET",
      }),
      transformResponse: (response: SessionResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "TutorSession", id }],
    }),

    getActiveSession: builder.query<TutorSessionRecord | null, void>({
      query: () => ({
        url: "/tutor/sessions/active",
        method: "GET",
      }),
      transformResponse: (response: SessionResponse) => response.data,
      providesTags: [{ type: "TutorSession", id: "ACTIVE" }],
    }),

    startTutorSession: builder.mutation<string, { mode?: string; topic?: string }>({
      query: (body) => ({
        url: "/tutor/sessions",
        method: "POST",
        body,
      }),
      transformResponse: (response: StartSessionResponse) => response.data.sessionId,
      invalidatesTags: ["TutorSession"],
    }),

    updateTutorSession: builder.mutation<
      void,
      {
        sessionId: string;
        incrementMessages?: boolean;
        quizCorrect?: boolean;
      }
    >({
      query: ({ sessionId, ...body }) => ({
        url: `/tutor/sessions/${sessionId}`,
        method: "PATCH",
        body,
      }),
    }),

    endTutorSession: builder.mutation<TutorSessionRecord | null, string>({
      query: (sessionId) => ({
        url: `/tutor/sessions/${sessionId}/end`,
        method: "POST",
      }),
      transformResponse: (response: SessionResponse) => response.data,
      invalidatesTags: ["TutorSession", "TutorStats"],
    }),

    getWeeklyStats: builder.query<WeeklyStats, void>({
      query: () => ({
        url: "/tutor/stats/weekly",
        method: "GET",
      }),
      transformResponse: (response: StatsResponse<WeeklyStats>) => response.data,
      providesTags: ["TutorStats"],
    }),

    getProfileStats: builder.query<ProfileStats, void>({
      query: () => ({
        url: "/tutor/stats/profile",
        method: "GET",
      }),
      transformResponse: (response: StatsResponse<ProfileStats>) => response.data,
      providesTags: ["TutorStats"],
    }),

    getTutorPreferences: builder.query<TutorPreferences, void>({
      query: () => ({
        url: "/tutor/preferences",
        method: "GET",
      }),
      transformResponse: (response: StatsResponse<TutorPreferences>) => response.data,
      providesTags: ["TutorPreferences"],
    }),

    updateTutorPreferences: builder.mutation<TutorPreferences, Partial<TutorPreferences>>({
      query: (body) => ({
        url: "/tutor/preferences",
        method: "PUT",
        body,
      }),
      transformResponse: (response: StatsResponse<TutorPreferences>) => response.data,
      async onQueryStarted(updates, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          tutorApi.util.updateQueryData("getTutorPreferences", undefined, (draft) => {
            Object.assign(draft, updates);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTutorSessionsQuery,
  useGetTutorSessionQuery,
  useGetActiveSessionQuery,
  useStartTutorSessionMutation,
  useUpdateTutorSessionMutation,
  useEndTutorSessionMutation,
  useGetWeeklyStatsQuery,
  useGetProfileStatsQuery,
  useGetTutorPreferencesQuery,
  useUpdateTutorPreferencesMutation,
} = tutorApi;
