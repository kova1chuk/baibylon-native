import { createApi } from '@reduxjs/toolkit/query/react';

import { dictionaryApi } from '@/entities/dictionary/api/dictionaryApi';
import { dashboardApi } from '@/features/hub/api/dashboardApi';
import { nestBaseQuery } from '@/shared/api/nestBaseQuery';

import type { ExerciseType, FocusFilter } from '../model/learningQueueSlice';

import type {
  LearningItemType,
  LearningStage,
  CEFRLevel,
  DailyPlanData,
} from './types';

interface StartSessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    startedAt: string;
    focusFilter: string;
    firstExercise: NextExerciseData | null;
  };
}

export interface NextExerciseData {
  exerciseType: ExerciseType;
  metadataId: string;
  itemType: LearningItemType;
  itemId: string;
  title: string;
  level: CEFRLevel | null;
  stage: LearningStage;
  totalScore: number;
  exerciseData: Record<string, unknown>;
}

export interface ScoringResult {
  pointsAwarded: number;
  streakBonus: number;
  dailyTotal: number;
  dailyTarget: number;
}

interface SubmitResultResponse {
  success: boolean;
  data: {
    updatedState: {
      stage: LearningStage;
      practiceCount: number;
      correctCount: number;
      consecutiveCorrect: number;
      nextReviewAt: string | null;
      correctSentence?: string;
      feedback?: string;
    };
    nextExercise: NextExerciseData | null;
    scoring: ScoringResult | null;
  };
}

export interface DailySummaryData {
  todayScore: number;
  dailyTarget: number;
  exercisesCompleted: number;
  correctCount: number;
  incorrectCount: number;
  bestStreak: number;
  timeSpentSeconds: number;
  streak: number;
  currentLevel: string;
  levelProgress: number;
}

interface DailySummaryResponse {
  success: boolean;
  data: DailySummaryData;
}

interface DailyPlanResponse {
  success: boolean;
  data: DailyPlanData;
}

export interface SessionHistoryItem {
  id: string;
  startedAt: string;
  queueSize: number;
  itemsCompleted: number;
  sessionDurationSeconds: number;
  avgResponseTimeMs: number | null;
  successRate: number | null;
  typeDistribution: Record<string, number>;
}

interface SessionHistoryResponse {
  success: boolean;
  data: SessionHistoryItem[];
}

export interface StreakInfoData {
  currentStreak: number;
  longestStreak: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  exercisesThisWeek: number;
  exercisesThisMonth: number;
}

interface StreakInfoResponse {
  success: boolean;
  data: StreakInfoData;
}

export interface LearningStatisticsData {
  totalSessions: number;
  totalItemsCompleted: number;
  avgSessionDurationMinutes: number;
  avgSuccessRate: number;
  totalTimeSpentHours: number;
  lastSessionAt: string | null;
  typeDistributionSummary: Record<string, number> | null;
}

interface LearningStatisticsResponse {
  success: boolean;
  data: LearningStatisticsData;
}

export type GoalIntensity = 'casual' | 'regular' | 'intensive';

export interface DailyProgressData {
  todayScore: number;
  intensity: GoalIntensity;
  tier1Threshold: number;
  tier2Threshold: number;
  tier3Threshold: number;
  currentTier: number;
  exercisesCompleted: number;
  correctCount: number;
  incorrectCount: number;
  timeSpentSeconds: number;
  bestStreak: number;
  streak: number;
}

interface DailyProgressResponse {
  success: boolean;
  data: DailyProgressData;
}

interface EndSessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    duration: number;
    totalExercises: number;
    correctCount: number;
    incorrectCount: number;
    itemsByType: Record<string, number>;
    stageProgressions: {
      metadataId: string;
      title: string;
      fromStage: LearningStage;
      toStage: LearningStage;
    }[];
  };
}

export interface ErrorHistoryItem {
  id: string;
  userId: string;
  errorPatternId: string | null;
  userInput: string;
  correction: string | null;
  context: string | null;
  messageId: string | null;
  sessionId: string | null;
  createdAt: string;
}

export interface GrammarMistakeItem {
  id: string;
  rule_id: string | null;
  rule_title: string | null;
  topic_name: string | null;
  user_input: string;
  correction: string | null;
  explanation: string | null;
  created_at: string;
}

export interface GrammarMistakeSummaryItem {
  rule_id: string;
  rule_title: string;
  topic_name: string;
  level_code: string;
  mistake_count: number;
  last_mistake_at: string;
  recent_examples: string[];
}

export const multiSessionApi = createApi({
  reducerPath: 'multiSessionApi',
  baseQuery: nestBaseQuery,
  tagTypes: ['MultiSession', 'DailyPlan', 'SessionAnalytics'],
  endpoints: builder => ({
    startMultiSession: builder.mutation<
      StartSessionResponse['data'],
      {
        focusFilter?: FocusFilter;
        topicId?: string;
        ruleId?: string;
        level?: CEFRLevel;
        preferredExerciseType?: ExerciseType;
      }
    >({
      query: ({
        focusFilter = 'all',
        topicId,
        ruleId,
        level,
        preferredExerciseType,
      }) => ({
        url: '/learning-queue/session/start',
        method: 'POST',
        body: {
          focusFilter,
          ...(topicId ? { topicId } : {}),
          ...(ruleId ? { ruleId } : {}),
          ...(level ? { level } : {}),
          ...(preferredExerciseType ? { preferredExerciseType } : {}),
        },
      }),
      transformResponse: (response: StartSessionResponse) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dictionaryApi.util.invalidateTags(['DictionaryStats', 'Words'])
        );
      },
    }),

    getNextExercise: builder.query<
      NextExerciseData | null,
      { sessionId: string }
    >({
      query: ({ sessionId }) => ({
        url: `/learning-queue/session/${sessionId}/next-exercise`,
        method: 'GET',
      }),
      transformResponse: (response: {
        success: boolean;
        data: NextExerciseData | null;
      }) => response.data,
    }),

    submitExerciseResult: builder.mutation<
      SubmitResultResponse['data'],
      {
        sessionId: string;
        metadataId: string;
        exerciseType: ExerciseType;
        correct: boolean;
        quality?: number;
        durationMs?: number;
        userAnswer?: string;
        sentenceExerciseId?: string;
        generatedExerciseId?: string;
      }
    >({
      query: body => ({
        url: '/learning-queue/session/exercise-result',
        method: 'POST',
        body,
      }),
      transformResponse: (response: SubmitResultResponse) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dictionaryApi.util.invalidateTags(['DictionaryStats', 'Words'])
        );
        dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
        dispatch(multiSessionApi.util.invalidateTags(['DailyPlan']));
      },
    }),

    endMultiSession: builder.mutation<
      EndSessionResponse['data'],
      { sessionId: string }
    >({
      query: ({ sessionId }) => ({
        url: `/learning-queue/session/${sessionId}/end`,
        method: 'POST',
      }),
      transformResponse: (response: EndSessionResponse) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dictionaryApi.util.invalidateTags(['DictionaryStats', 'Words'])
        );
        dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
        dispatch(
          multiSessionApi.util.invalidateTags(['DailyPlan', 'SessionAnalytics'])
        );
      },
    }),

    getDailySummary: builder.query<DailySummaryData, void>({
      query: () => ({
        url: '/learning-queue/daily-summary',
        method: 'GET',
      }),
      transformResponse: (response: DailySummaryResponse) => response.data,
    }),

    getDailyPlan: builder.query<DailyPlanData, void>({
      query: () => ({
        url: '/learning-queue/daily-plan',
        method: 'GET',
      }),
      transformResponse: (response: DailyPlanResponse) => response.data,
      providesTags: ['DailyPlan'],
    }),

    getDailyProgress: builder.query<DailyProgressData, void>({
      query: () => ({
        url: '/learning-queue/daily-progress',
        method: 'GET',
      }),
      transformResponse: (response: DailyProgressResponse) => response.data,
      providesTags: ['SessionAnalytics'],
    }),

    updateGoalIntensity: builder.mutation<void, { intensity: GoalIntensity }>({
      query: ({ intensity }) => ({
        url: '/learning-queue/goal-intensity',
        method: 'PUT',
        body: { intensity },
      }),
      invalidatesTags: ['SessionAnalytics'],
    }),

    getSessionHistory: builder.query<
      SessionHistoryItem[],
      { days?: number; limit?: number } | void
    >({
      query: args => ({
        url: `/learning-queue/session-history?days=${args?.days ?? 30}&limit=${args?.limit ?? 20}`,
        method: 'GET',
      }),
      transformResponse: (response: SessionHistoryResponse) => response.data,
      providesTags: ['SessionAnalytics'],
    }),

    getStreakInfo: builder.query<StreakInfoData, void>({
      query: () => ({
        url: '/learning-queue/streak-info',
        method: 'GET',
      }),
      transformResponse: (response: StreakInfoResponse) => response.data,
      providesTags: ['SessionAnalytics'],
    }),

    getLearningStatistics: builder.query<LearningStatisticsData, void>({
      query: () => ({
        url: '/learning-queue/statistics',
        method: 'GET',
      }),
      transformResponse: (response: LearningStatisticsResponse) =>
        response.data,
      providesTags: ['SessionAnalytics'],
    }),

    getErrorHistory: builder.query<ErrorHistoryItem[], { limit?: number }>({
      query: ({ limit = 50 }) => ({
        url: `/learning-queue/error-history?limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        success: boolean;
        data: ErrorHistoryItem[];
      }) => response.data,
    }),

    getGrammarMistakes: builder.query<GrammarMistakeItem[], { limit?: number }>(
      {
        query: ({ limit = 50 }) => ({
          url: `/grammar/mistakes?limit=${limit}`,
          method: 'GET',
        }),
        transformResponse: (response: {
          success: boolean;
          data: GrammarMistakeItem[];
        }) => response.data,
      }
    ),

    getGrammarMistakeSummary: builder.query<GrammarMistakeSummaryItem[], void>({
      query: () => ({
        url: '/grammar/mistake-summary',
        method: 'GET',
      }),
      transformResponse: (response: {
        success: boolean;
        data: GrammarMistakeSummaryItem[];
      }) => response.data,
    }),
  }),
});

export const {
  useStartMultiSessionMutation,
  useGetNextExerciseQuery,
  useSubmitExerciseResultMutation,
  useEndMultiSessionMutation,
  useGetDailySummaryQuery,
  useGetDailyPlanQuery,
  useGetDailyProgressQuery,
  useUpdateGoalIntensityMutation,
  useGetSessionHistoryQuery,
  useGetStreakInfoQuery,
  useGetLearningStatisticsQuery,
  useGetErrorHistoryQuery,
  useGetGrammarMistakesQuery,
  useGetGrammarMistakeSummaryQuery,
} = multiSessionApi;
