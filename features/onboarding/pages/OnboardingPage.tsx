import React, { useCallback, useState } from 'react';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from 'react-native';

import { Text } from '@/components/ui/text';

import { useColors } from '@/hooks/useColors';

import {
  useSubmitLanguagesMutation,
  useSubmitGoalMutation,
  useCompleteOnboardingMutation,
} from '../api/onboardingApi';
import type { AssessmentResult, GoalIntensity } from '../api/onboardingApi';
import AssessmentStep from '../components/AssessmentStep';
import GoalStep from '../components/GoalStep';
import ReadyStep from '../components/ReadyStep';
import StepDots from '../components/StepDots';
import WelcomeStep from '../components/WelcomeStep';
import { STEPS, type Step } from '../constants';

export default function OnboardingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [step, setStep] = useState<Step>('welcome');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<GoalIntensity | null>(null);
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);

  const [submitLanguages, { isLoading: isSubmittingLanguages }] =
    useSubmitLanguagesMutation();
  const [submitGoal, { isLoading: isSubmittingGoal }] = useSubmitGoalMutation();
  const [completeOnboarding, { isLoading: isCompleting }] =
    useCompleteOnboardingMutation();

  const goTo = useCallback((next: Step) => {
    setStep(next);
  }, []);

  const handleLanguageContinue = useCallback(async () => {
    try {
      await submitLanguages({
        nativeLanguage,
        learningLanguage: 'en',
      }).unwrap();
      goTo('assessment');
    } catch {}
  }, [nativeLanguage, submitLanguages, goTo]);

  const handleAssessmentComplete = useCallback((result: AssessmentResult) => {
    setAssessmentResult(result);
    setStep('goal');
  }, []);

  const handleGoalContinue = useCallback(async () => {
    if (!selectedGoal) return;
    try {
      await submitGoal({ intensity: selectedGoal }).unwrap();
      goTo('ready');
    } catch {}
  }, [selectedGoal, submitGoal, goTo]);

  const handleStart = useCallback(async () => {
    try {
      await completeOnboarding().unwrap();
      router.replace('/(tabs)');
    } catch {}
  }, [completeOnboarding, router]);

  const stepIndex = STEPS.indexOf(step);

  return (
    <View
      className="flex-1"
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom,
        backgroundColor: colors.background,
      }}
    >
      <View className="flex-row items-center justify-between px-5 mb-6">
        <View className="flex-row items-center gap-2">
          <View
            className="h-7 w-7 rounded-lg items-center justify-center"
            style={{
              backgroundColor: '#818cf8',
            }}
          >
            <Text className="text-sm font-bold text-white">V</Text>
          </View>
          <Text className="font-semibold text-foreground">Vocairo</Text>
        </View>
        <StepDots current={stepIndex} total={STEPS.length} />
      </View>

      <View className="flex-1 px-5">
        {step === 'welcome' && (
          <WelcomeStep
            nativeLanguage={nativeLanguage}
            onNativeChange={setNativeLanguage}
            onContinue={handleLanguageContinue}
            isLoading={isSubmittingLanguages}
          />
        )}

        {step === 'assessment' && (
          <View className="flex-1">
            <View className="mb-4">
              <View
                className="mb-2 h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'rgba(129,140,248,0.12)' }}
              >
                <Text className="text-2xl">📝</Text>
              </View>
              <Text className="text-3xl font-semibold text-foreground mb-1">
                {t('onboarding.assessmentTitle')}
              </Text>
              <Text className="text-base text-muted-foreground leading-relaxed">
                {t('onboarding.assessmentDescription')}
              </Text>
            </View>
            <AssessmentStep onComplete={handleAssessmentComplete} />
          </View>
        )}

        {step === 'goal' && (
          <GoalStep
            selected={selectedGoal}
            onSelect={setSelectedGoal}
            onContinue={handleGoalContinue}
            isLoading={isSubmittingGoal}
          />
        )}

        {step === 'ready' && assessmentResult && selectedGoal && (
          <ReadyStep
            level={assessmentResult.level}
            goalIntensity={selectedGoal}
            onStart={handleStart}
            isLoading={isCompleting}
          />
        )}
      </View>
    </View>
  );
}
