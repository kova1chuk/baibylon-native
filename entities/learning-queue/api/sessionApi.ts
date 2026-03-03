import { createApi } from "@reduxjs/toolkit/query/react";

import { nestBaseQuery } from "@/shared/api/nestBaseQuery";

export interface LearningSession {
  id: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  date: string;
  activities: SessionActivity[];
  totalPoints: number;
  exercisesCompleted: number;
  correctCount: number;
  wrongCount: number;
  tierReached: string | null;
}

export interface SessionActivity {
  type: string;
  exerciseType?: string;
  count?: number;
  correct?: number;
  duration?: number;
}

export interface DailySessionStats {
  date: string;
  sessionCount: number;
  totalPoints: number;
  totalDurationSeconds: number;
  exercisesCompleted: number;
  correctCount: number;
  wrongCount: number;
  bestTier: string | null;
}

export const sessionApi = createApi({
  reducerPath: "sessionApi",
  baseQuery: nestBaseQuery,
  tagTypes: ["Sessions", "SessionStats"],
  endpoints: (builder) => ({
    listSessions: builder.query<
      { sessions: LearningSession[]; total: number },
      { limit?: number; offset?: number } | void
    >({
      query: (params) => ({
        url: "/sessions",
        params: params ? { limit: params.limit, offset: params.offset } : undefined,
      }),
      providesTags: ["Sessions"],
    }),

    getDailyStats: builder.query<DailySessionStats[], { days?: number } | void>({
      query: (params) => ({
        url: "/sessions/stats",
        params: params ? { days: params.days } : undefined,
      }),
      providesTags: ["SessionStats"],
    }),

    getActiveSession: builder.query<LearningSession | null, void>({
      query: () => ({ url: "/sessions/active" }),
      providesTags: ["Sessions"],
    }),

    startSession: builder.mutation<LearningSession, void>({
      query: () => ({ url: "/sessions", method: "POST" }),
      invalidatesTags: ["Sessions"],
    }),

    updateSession: builder.mutation<
      LearningSession,
      {
        sessionId: string;
        activities?: SessionActivity[];
        totalPoints?: number;
        exercisesCompleted?: number;
        correctCount?: number;
        wrongCount?: number;
        tierReached?: string;
      }
    >({
      query: ({ sessionId, ...body }) => ({
        url: `/sessions/${sessionId}`,
        method: "PATCH",
        body,
      }),
    }),

    endSession: builder.mutation<LearningSession, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/sessions/${sessionId}/end`,
        method: "POST",
      }),
      invalidatesTags: ["Sessions", "SessionStats"],
    }),
  }),
});

export const {
  useListSessionsQuery,
  useGetDailyStatsQuery,
  useGetActiveSessionQuery,
  useStartSessionMutation,
  useUpdateSessionMutation,
  useEndSessionMutation,
} = sessionApi;
