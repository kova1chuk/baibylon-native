export { default as OnboardingPage } from './pages/OnboardingPage';
export { default as OnboardingGuard } from './components/OnboardingGuard';
export {
  onboardingApi,
  useGetOnboardingStatusQuery,
  useGetAssessmentQuestionsQuery,
  useSubmitLanguagesMutation,
  useSubmitAssessmentMutation,
  useSubmitGoalMutation,
  useCompleteOnboardingMutation,
} from './api/onboardingApi';
export type {
  OnboardingStatusData,
  OnboardingStage,
  AssessmentQuestion,
  AssessmentResult,
  GoalIntensity,
} from './api/onboardingApi';
