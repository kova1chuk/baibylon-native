import { createApi } from '@reduxjs/toolkit/query/react';

import { nestBaseQuery } from '@/shared/api/nestBaseQuery';

export type GoalIntensity = 'casual' | 'regular' | 'intensive';

export type OnboardingStage =
  | 'pending'
  | 'languages'
  | 'assessment'
  | 'goal'
  | 'complete';

export interface OnboardingStatusData {
  stage: OnboardingStage;
  nativeLanguage: string | null;
  learningLanguage: string | null;
  estimatedLevel: string | null;
  goalIntensity: GoalIntensity | null;
  completedAt: string | null;
}

export interface AssessmentQuestion {
  id: string;
  level: string;
  sentence: string;
  options: string[];
  correctIndex: number;
}

export interface AssessmentResult {
  level: string;
  correctCount: number;
  totalCount: number;
}

interface OnboardingStatusResponse {
  success: boolean;
  data: OnboardingStatusData;
}

interface AssessmentQuestionsResponse {
  success: boolean;
  data: AssessmentQuestion[];
}

interface AssessmentSubmitResponse {
  success: boolean;
  data: AssessmentResult;
}

export const onboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: nestBaseQuery,
  tagTypes: ['OnboardingStatus'],
  endpoints: builder => ({
    getOnboardingStatus: builder.query<OnboardingStatusData, void>({
      query: () => ({
        url: '/onboarding/status',
        method: 'GET',
      }),
      transformResponse: (response: OnboardingStatusResponse) => response.data,
      providesTags: ['OnboardingStatus'],
    }),

    getAssessmentQuestions: builder.query<AssessmentQuestion[], void>({
      query: () => ({
        url: '/onboarding/assessment-questions',
        method: 'GET',
      }),
      transformResponse: (response: AssessmentQuestionsResponse) =>
        response.data,
    }),

    submitLanguages: builder.mutation<
      void,
      { nativeLanguage: string; learningLanguage: string }
    >({
      query: body => ({
        url: '/onboarding/languages',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OnboardingStatus'],
    }),

    submitAssessment: builder.mutation<
      AssessmentResult,
      { answers: { questionId: string; selectedIndex: number }[] }
    >({
      query: body => ({
        url: '/onboarding/assessment',
        method: 'POST',
        body,
      }),
      transformResponse: (response: AssessmentSubmitResponse) => response.data,
      invalidatesTags: ['OnboardingStatus'],
    }),

    submitGoal: builder.mutation<void, { intensity: GoalIntensity }>({
      query: body => ({
        url: '/onboarding/goal',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OnboardingStatus'],
    }),

    completeOnboarding: builder.mutation<void, void>({
      query: () => ({
        url: '/onboarding/complete',
        method: 'POST',
      }),
      invalidatesTags: ['OnboardingStatus'],
    }),
  }),
});

export const {
  useGetOnboardingStatusQuery,
  useGetAssessmentQuestionsQuery,
  useSubmitLanguagesMutation,
  useSubmitAssessmentMutation,
  useSubmitGoalMutation,
  useCompleteOnboardingMutation,
} = onboardingApi;
