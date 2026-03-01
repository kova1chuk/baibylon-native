import React, { useCallback, useMemo } from 'react';

import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import {
  useGetUnifiedQueueQuery,
  useSubmitLearningResultMutation,
} from '@/entities/dictionary/api/dictionaryApi';
import {
  useStartExerciseSessionMutation,
  useSubmitExerciseAnswerMutation,
} from '@/entities/exercise/api/exerciseApi';

import { useSmartSession } from '../hooks/useSmartSession';

import MultipleChoiceCard from './MultipleChoiceCard';
import SmartSessionSummary from './SmartSessionSummary';

import type { MultipleChoiceContent } from '@/entities/exercise/api/exerciseApi';

export default function TrainingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data: queueItems, isLoading: queueLoading } = useGetUnifiedQueueQuery(
    { size: 20 }
  );
  const [submitLearningResult] = useSubmitLearningResultMutation();
  const [startExerciseSession] = useStartExerciseSessionMutation();
  const [submitExerciseAnswer] = useSubmitExerciseAnswerMutation();

  const items = useMemo(() => queueItems || [], [queueItems]);

  const session = useSmartSession({
    items,
    onSubmitResult: useCallback(
      (item: { metadataId: string }, correct: boolean, quality: number) => {
        submitLearningResult({
          metadataId: item.metadataId,
          correct,
          quality,
        });
      },
      [submitLearningResult]
    ),
  });

  const handleExit = useCallback(() => {
    Alert.alert(t('training.exit'), t('training.stopAnytime'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.exit'),
        style: 'destructive',
        onPress: () => {
          session.reset();
          router.back();
        },
      },
    ]);
  }, [session, router, t]);

  const handleDone = useCallback(() => {
    session.reset();
    router.back();
  }, [session, router]);

  if (queueLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-4">
          {t('learningFeed.loadingQueue')}
        </Text>
      </View>
    );
  }

  if (session.phase === 'summary') {
    return (
      <SmartSessionSummary
        stats={session.stats}
        elapsedSeconds={session.elapsedSeconds}
        streakBest={session.streakBest}
        onContinue={() => session.start()}
        onRetryMistakes={() => session.retryMistakes()}
        onDone={handleDone}
        hasWrongAnswers={session.stats.wrong > 0}
      />
    );
  }

  if (session.phase === 'idle') {
    const typeCounts = items.reduce(
      (acc, item) => {
        acc[item.itemType] = (acc[item.itemType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return (
      <View
        className="flex-1 bg-background"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-between px-4 pb-4">
          <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('training.smartSession')}
          </Text>
          <Pressable onPress={() => router.back()} className="p-2">
            <X size={20} color={isDark ? '#FAFAF9' : '#111827'} />
          </Pressable>
        </View>

        <View className="flex-1 px-4 justify-center">
          <View className="bg-card rounded-2xl p-6 shadow-sm">
            <Text className="text-2xl font-bold text-foreground mb-2">
              {t('training.smartSession')}
            </Text>
            <Text className="text-base text-muted-foreground mb-6">
              {t('training.smartSessionDesc')}
            </Text>

            {items.length > 0 ? (
              <>
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-foreground mb-3">
                    {t('training.queueComposition')}
                  </Text>
                  <View className="gap-2">
                    {Object.entries(typeCounts).map(([type, count]) => (
                      <View
                        key={type}
                        className="flex-row items-center justify-between"
                      >
                        <Text className="text-sm text-muted-foreground capitalize">
                          {type.replace('_', ' ')}
                        </Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {count} {t('training.items')}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Pressable
                  className="bg-primary rounded-xl py-4 items-center active:opacity-80"
                  onPress={() => session.start()}
                >
                  <Text className="text-white font-semibold text-base">
                    {t('common.startSession')}
                  </Text>
                </Pressable>

                <Text className="text-xs text-muted-foreground text-center mt-3">
                  {t('training.stopAnytime')}
                </Text>
              </>
            ) : (
              <View className="items-center py-6">
                <Text className="text-base text-muted-foreground text-center">
                  {t('training.noItemsAvailable')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  const progress =
    session.sessionItems.length > 0
      ? ((session.currentIndex + 1) / session.sessionItems.length) * 100
      : 0;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center justify-between px-4 pb-3">
        <Pressable onPress={handleExit} className="p-2 active:opacity-50">
          <X size={20} color={isDark ? '#FAFAF9' : '#111827'} />
        </Pressable>

        <View className="flex-row items-center gap-4">
          <Text className="text-sm text-muted-foreground">
            {session.completedCount}/{session.sessionItems.length}
          </Text>
          <Text className="text-sm font-semibold text-foreground">
            {session.stats.accuracy}%
          </Text>
        </View>

        <Pressable
          onPress={() => session.endSession()}
          className="active:opacity-50"
        >
          <Text className="text-sm font-medium text-primary">
            {t('learningFeed.endSession')}
          </Text>
        </Pressable>
      </View>

      <View className="h-1 mx-4 bg-muted rounded-full overflow-hidden mb-2">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </View>

      {session.currentItem && (
        <ExerciseRouter
          item={session.currentItem}
          isLocked={session.isLocked}
          onAnswer={session.submitAnswer}
          onNext={session.nextItem}
          startExerciseSession={startExerciseSession}
          submitExerciseAnswer={submitExerciseAnswer}
        />
      )}
    </View>
  );
}

function ExerciseRouter({
  item,
  isLocked,
  onAnswer,
  onNext,
}: {
  item: { itemType: string; title: string; metadataId: string };
  isLocked: boolean;
  onAnswer: (correct: boolean, quality: number, answer?: string) => void;
  onNext: () => void;
  startExerciseSession: ReturnType<typeof useStartExerciseSessionMutation>[0];
  submitExerciseAnswer: ReturnType<typeof useSubmitExerciseAnswerMutation>[0];
}) {
  const { t } = useTranslation();

  const placeholderContent: MultipleChoiceContent = {
    wordId: item.metadataId,
    direction: 'word_to_translation',
    prompt: t('learningFeed.chooseTranslation'),
    options: [item.title, '...', '...', '...'],
    correctIndex: 0,
    word: item.title,
    translation: '',
    definition: '',
    ipa: '',
    audioUrl: '',
    partOfSpeech: [],
    estimatedLevel: null,
    currentMastery: 0,
    skill: 0,
    seenCount: 0,
    lastSeenAt: null,
    nextDueAt: null,
    mcOptionId: null,
  };

  return (
    <MultipleChoiceCard
      content={placeholderContent}
      onAnswer={(correct, _selectedIndex) => {
        onAnswer(correct, correct ? 5 : 1);
      }}
      onNext={onNext}
      isLocked={isLocked}
    />
  );
}
