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
  isContextFillContent,
  isErrorCorrectionContent,
  isMultipleChoiceContent,
  isOddOneOutContent,
  isPhraseBuilderContent,
  isRuleQuizContent,
  isTranslateSentenceContent,
  isTypeTheWordContent,
} from '@/entities/exercise/api/exerciseApi';

import { useSmartSession } from '../hooks/useSmartSession';

import ContextFillCard from './ContextFillCard';
import ErrorCorrectionCard from './ErrorCorrectionCard';
import MultipleChoiceCard from './MultipleChoiceCard';
import OddOneOutCard from './OddOneOutCard';
import PhraseBuilderCard from './PhraseBuilderCard';
import RuleQuizCard from './RuleQuizCard';
import SmartSessionSummary from './SmartSessionSummary';
import TranslateSentenceCard from './TranslateSentenceCard';
import TypeWordCard from './TypeWordCard';

import type { UnifiedQueueItem } from '@/entities/dictionary/api/types';
import type {
  ExerciseContent,
  MultipleChoiceContent,
  TypeTheWordContent,
} from '@/entities/exercise/api/exerciseApi';

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
          index={session.currentIndex}
          isLocked={session.isLocked}
          onAnswer={session.submitAnswer}
          onNext={session.nextItem}
        />
      )}
    </View>
  );
}

function buildContentForItem(
  item: UnifiedQueueItem,
  index: number,
  t: (key: string) => string
): { type: string; content: ExerciseContent } {
  const data = item.typeSpecificData || {};
  const translation = (data.translation as string) || '';
  const definition = (data.definition as string) || '';
  const ipa = (data.ipa as string) || (data.phonetic as string) || '';
  const audioUrl = (data.audioUrl as string) || '';
  const partOfSpeech = (data.partOfSpeech as string[]) || [];
  const estimatedLevel = (data.estimatedLevel as string) || null;
  const currentMastery = (data.currentMastery as number) || 0;

  const wordMeta = {
    wordId: item.metadataId,
    word: item.title,
    translation,
    definition,
    ipa,
    audioUrl,
    partOfSpeech,
    estimatedLevel,
    currentMastery,
    skill: 0,
    seenCount: 0,
    lastSeenAt: null,
    nextDueAt: null,
  };

  // Rotate exercise type based on index for variety
  if (item.itemType === 'word' || item.itemType === 'phrase') {
    const variant = index % 3;

    if (variant === 0) {
      const mc: MultipleChoiceContent = {
        ...wordMeta,
        direction: 'word_to_translation',
        prompt: t('learningFeed.chooseTranslation'),
        options: translation
          ? [translation, '...', '...', '...']
          : [item.title, '...', '...', '...'],
        correctIndex: 0,
        mcOptionId: null,
      };
      return { type: 'multiple_choice', content: mc };
    }

    if (variant === 1 && translation) {
      const tw: TypeTheWordContent = {
        ...wordMeta,
        prompt: t('learningFeed.typeWord'),
        correctAnswer: item.title,
        hint:
          item.title.length > 2
            ? `${item.title[0]}...${item.title[item.title.length - 1]}`
            : '',
      };
      return { type: 'type_the_word', content: tw };
    }

    // Default to multiple choice
    const mc: MultipleChoiceContent = {
      ...wordMeta,
      direction: translation ? 'translation_to_word' : 'word_to_translation',
      prompt: translation
        ? t('learningFeed.chooseTranslation')
        : t('learningFeed.chooseTranslation'),
      options: translation
        ? [item.title, '...', '...', '...']
        : [item.title, '...', '...', '...'],
      correctIndex: 0,
      mcOptionId: null,
    };
    return { type: 'multiple_choice', content: mc };
  }

  if (
    item.itemType === 'grammar_rule' ||
    item.itemType === 'grammar_vocabulary'
  ) {
    const mc: MultipleChoiceContent = {
      ...wordMeta,
      direction: 'word_to_translation',
      prompt: item.title,
      options: [translation || item.title, '...', '...', '...'],
      correctIndex: 0,
      mcOptionId: null,
    };
    return { type: 'multiple_choice', content: mc };
  }

  // Fallback: multiple choice
  const mc: MultipleChoiceContent = {
    ...wordMeta,
    direction: 'word_to_translation',
    prompt: t('learningFeed.chooseTranslation'),
    options: [translation || item.title, '...', '...', '...'],
    correctIndex: 0,
    mcOptionId: null,
  };
  return { type: 'multiple_choice', content: mc };
}

function ExerciseRouter({
  item,
  index,
  isLocked,
  onAnswer,
  onNext,
}: {
  item: UnifiedQueueItem;
  index: number;
  isLocked: boolean;
  onAnswer: (correct: boolean, quality: number, answer?: string) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();

  const { content } = useMemo(
    () => buildContentForItem(item, index, t),
    [item, index, t]
  );

  // Route using type guards for real exercise content
  if (isContextFillContent(content)) {
    return (
      <ContextFillCard
        content={content}
        onAnswer={(correct, selectedOption) => {
          onAnswer(correct, correct ? 5 : 1, selectedOption);
        }}
        onNext={onNext}
        isLocked={isLocked}
      />
    );
  }

  if (isTypeTheWordContent(content)) {
    return (
      <TypeWordCard
        content={content}
        onAnswer={(correct, typedWord) => {
          onAnswer(correct, correct ? 5 : 1, typedWord);
        }}
        onNext={onNext}
        isLocked={isLocked}
      />
    );
  }

  if (isOddOneOutContent(content)) {
    return (
      <OddOneOutCard
        content={content}
        onAnswer={(correct, _selectedIndex) => {
          onAnswer(correct, correct ? 5 : 1);
        }}
        onNext={onNext}
        isLocked={isLocked}
      />
    );
  }

  if (isRuleQuizContent(content)) {
    return (
      <RuleQuizCard
        content={content}
        onAnswer={(correct, _selectedIndex) => {
          onAnswer(correct, correct ? 5 : 1);
        }}
        onNext={onNext}
        isLocked={isLocked}
      />
    );
  }

  if (isErrorCorrectionContent(content)) {
    return (
      <ErrorCorrectionCard
        content={content}
        onAnswer={(correct, userCorrection) => {
          onAnswer(correct, correct ? 5 : 1, userCorrection);
        }}
        onNext={onNext}
        isLocked={isLocked}
      />
    );
  }

  if (isTranslateSentenceContent(content)) {
    return (
      <TranslateSentenceCard
        content={content}
        onAnswer={(correct, userTranslation) => {
          onAnswer(correct, correct ? 5 : 1, userTranslation);
        }}
        onNext={onNext}
        isLocked={isLocked}
      />
    );
  }

  if (isPhraseBuilderContent(content)) {
    return (
      <PhraseBuilderCard
        content={content}
        onAnswer={(correct, _arrangedWords) => {
          onAnswer(correct, correct ? 5 : 1);
        }}
        onNext={onNext}
        isLocked={isLocked}
      />
    );
  }

  // Default: MultipleChoiceCard
  if (isMultipleChoiceContent(content)) {
    return (
      <MultipleChoiceCard
        content={content}
        onAnswer={(correct, _selectedIndex) => {
          onAnswer(correct, correct ? 5 : 1);
        }}
        onNext={onNext}
        isLocked={isLocked}
      />
    );
  }

  // Ultimate fallback — cast to MultipleChoiceContent
  return (
    <MultipleChoiceCard
      content={content as unknown as MultipleChoiceContent}
      onAnswer={(correct, _selectedIndex) => {
        onAnswer(correct, correct ? 5 : 1);
      }}
      onNext={onNext}
      isLocked={isLocked}
    />
  );
}
