import React, { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import {
  isContextFillContent,
  isErrorCorrectionContent,
  isMultipleChoiceContent,
  isOddOneOutContent,
  isPhraseBuilderContent,
  isRuleQuizContent,
  isTranslateSentenceContent,
  isTypeTheWordContent,
} from "@/entities/exercise/api/exerciseApi";
import {
  useStartMultiSessionMutation,
  useSubmitExerciseResultMutation,
  useEndMultiSessionMutation,
} from "@/entities/learning-queue/api/multiSessionApi";
import {
  startMultiSession as startMultiSessionAction,
  setCurrentExercise,
  recordExerciseResult,
  endMultiSession as endMultiSessionAction,
  resetMultiSession,
} from "@/entities/learning-queue/model/learningQueueSlice";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";

import { useColors } from "@/hooks/useColors";

import ContextFillCard from "./ContextFillCard";
import ErrorCorrectionCard from "./ErrorCorrectionCard";
import FlashcardCard from "./FlashcardCard";
import MultipleChoiceCard from "./MultipleChoiceCard";
import OddOneOutCard from "./OddOneOutCard";
import PhraseBuilderCard from "./PhraseBuilderCard";
import RuleQuizCard from "./RuleQuizCard";
import SmartSessionSummary from "./SmartSessionSummary";
import type { SessionConfig } from "./TrainingHubScreen";
import TranslateSentenceCard from "./TranslateSentenceCard";
import TypeWordCard from "./TypeWordCard";

import type { ExerciseContent, MultipleChoiceContent } from "@/entities/exercise/api/exerciseApi";
import type { NextExerciseData } from "@/entities/learning-queue/api/multiSessionApi";
import type { CurrentExercise } from "@/entities/learning-queue/model/learningQueueSlice";

interface TrainingScreenProps {
  sessionConfig: SessionConfig;
  onBack?: () => void;
}

function nextExerciseToCurrentExercise(data: NextExerciseData): CurrentExercise {
  return {
    metadataId: data.metadataId,
    exerciseType: data.exerciseType,
    itemType: data.itemType,
    itemId: data.itemId,
    title: data.title,
    level: data.level,
    stage: data.stage,
    totalScore: data.totalScore,
    exerciseData: data.exerciseData,
  };
}

export default function TrainingScreen({ sessionConfig, onBack }: TrainingScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = useColors();
  const dispatch = useAppDispatch();

  const { sessionId, sessionPhase, currentExercise, stats, exerciseStartTime } = useAppSelector(
    (state) => state.learningQueue,
  );

  const [startMultiSession, { isLoading: isStarting }] = useStartMultiSessionMutation();
  const [submitExerciseResult] = useSubmitExerciseResultMutation();
  const [endMultiSessionApi] = useEndMultiSessionMutation();

  const nextExerciseRef = useRef<NextExerciseData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const hasStartedRef = useRef(false);

  // Best streak tracking
  const [streakBest, setStreakBest] = useState(0);
  const currentStreakRef = useRef(0);

  // Auto-start session on mount
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const start = async () => {
      try {
        const result = await startMultiSession({
          focusFilter: sessionConfig.focusFilter,
          preferredExerciseType: sessionConfig.preferredExerciseType,
        }).unwrap();

        dispatch(
          startMultiSessionAction({
            sessionId: result.sessionId,
            firstExercise: result.firstExercise
              ? nextExerciseToCurrentExercise(result.firstExercise)
              : null,
          }),
        );

        sessionStartRef.current = Date.now();
      } catch {
        // Session start failed — go back
        Alert.alert(
          t("common.error"),
          t("training.sessionStartError") || "Could not start session",
          [{ text: t("common.ok"), onPress: () => goBack() }],
        );
      }
    };

    start();

    return () => {
      dispatch(resetMultiSession());
    };
  }, []);

  // Timer
  useEffect(() => {
    if (sessionPhase === "active") {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - sessionStartRef.current) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessionPhase]);

  const goBack = useCallback(() => {
    if (onBack) onBack();
    else router.back();
  }, [onBack, router]);

  const handleExit = useCallback(() => {
    Alert.alert(t("training.exit"), t("training.stopAnytime"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.exit"),
        style: "destructive",
        onPress: async () => {
          if (sessionId) {
            try {
              await endMultiSessionApi({ sessionId }).unwrap();
            } catch {
              // Ignore end session errors on exit
            }
          }
          dispatch(resetMultiSession());
          goBack();
        },
      },
    ]);
  }, [sessionId, goBack, t, endMultiSessionApi, dispatch]);

  const handleEndSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      await endMultiSessionApi({ sessionId }).unwrap();
    } catch {
      // Proceed to summary even if end call fails
    }
    dispatch(
      endMultiSessionAction({
        durationSeconds: Math.floor((Date.now() - sessionStartRef.current) / 1000),
      }),
    );
  }, [sessionId, endMultiSessionApi, dispatch]);

  const handleAnswer = useCallback(
    async (correct: boolean, quality: number, answer?: string) => {
      if (!sessionId || !currentExercise || isSubmitting) return;

      setIsSubmitting(true);
      setIsLocked(true);

      const durationMs = exerciseStartTime ? Date.now() - exerciseStartTime : 0;

      // Track streaks
      if (correct) {
        currentStreakRef.current += 1;
        if (currentStreakRef.current > streakBest) {
          setStreakBest(currentStreakRef.current);
        }
      } else {
        currentStreakRef.current = 0;
      }

      try {
        const result = await submitExerciseResult({
          sessionId,
          metadataId: currentExercise.metadataId,
          exerciseType: currentExercise.exerciseType,
          correct,
          quality,
          durationMs,
          userAnswer: answer,
        }).unwrap();

        const previousStage = currentExercise.stage;
        const newStage = result.updatedState.stage;
        const stageProgression =
          previousStage !== newStage
            ? {
                metadataId: currentExercise.metadataId,
                title: currentExercise.title,
                fromStage: previousStage,
                toStage: newStage,
              }
            : undefined;

        dispatch(
          recordExerciseResult({
            metadataId: currentExercise.metadataId,
            exerciseType: currentExercise.exerciseType,
            correct,
            durationMs,
            stageProgression,
            scoring: result.scoring,
          }),
        );

        nextExerciseRef.current = result.nextExercise;
      } catch {
        // If submit fails, still allow continuing
        nextExerciseRef.current = null;
      }

      setIsSubmitting(false);
    },
    [
      sessionId,
      currentExercise,
      isSubmitting,
      exerciseStartTime,
      streakBest,
      submitExerciseResult,
      dispatch,
    ],
  );

  const handleNext = useCallback(() => {
    setIsLocked(false);
    const next = nextExerciseRef.current;
    if (next) {
      dispatch(setCurrentExercise(nextExerciseToCurrentExercise(next)));
      nextExerciseRef.current = null;
    } else {
      // No more exercises — end session
      handleEndSession();
    }
  }, [dispatch, handleEndSession]);

  const handleDone = useCallback(() => {
    dispatch(resetMultiSession());
    goBack();
  }, [dispatch, goBack]);

  const handleContinue = useCallback(async () => {
    dispatch(resetMultiSession());
    setElapsedSeconds(0);
    setStreakBest(0);
    currentStreakRef.current = 0;
    sessionStartRef.current = Date.now();
    hasStartedRef.current = false;

    try {
      const result = await startMultiSession({
        focusFilter: sessionConfig.focusFilter,
        preferredExerciseType: sessionConfig.preferredExerciseType,
      }).unwrap();

      dispatch(
        startMultiSessionAction({
          sessionId: result.sessionId,
          firstExercise: result.firstExercise
            ? nextExerciseToCurrentExercise(result.firstExercise)
            : null,
        }),
      );
    } catch {
      goBack();
    }
  }, [dispatch, startMultiSession, sessionConfig, goBack]);

  // Loading state
  if (isStarting || sessionPhase === "setup") {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-4">{t("learningFeed.loadingQueue")}</Text>
      </View>
    );
  }

  // Summary screen
  if (sessionPhase === "summary") {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

    return (
      <SmartSessionSummary
        stats={{
          total: stats.total,
          correct: stats.correct,
          wrong: stats.incorrect,
          accuracy,
          typeCounts: stats.itemsByType,
        }}
        elapsedSeconds={stats.durationSeconds || elapsedSeconds}
        streakBest={streakBest}
        onContinue={handleContinue}
        onRetryMistakes={handleContinue}
        onDone={handleDone}
        hasWrongAnswers={stats.incorrect > 0}
      />
    );
  }

  // No exercise available (empty queue from backend)
  if (!currentExercise) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="text-lg font-semibold text-foreground mb-2">
          {t("training.allDoneTitle") || "All Done!"}
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-6">
          {t("training.noItemsAvailable")}
        </Text>
        <Pressable
          className="bg-primary rounded-xl py-4 px-8 active:opacity-80"
          onPress={handleDone}
        >
          <Text className="text-white font-semibold text-base">{t("common.done") || "Done"}</Text>
        </Pressable>
      </View>
    );
  }

  // Active session
  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top + 8, backgroundColor: colors.background }}
    >
      <View className="flex-row items-center justify-between px-4 pb-3">
        <Pressable onPress={handleExit} className="p-2 active:opacity-50">
          <X size={20} color={isDark ? "#FAFAF9" : "#111827"} />
        </Pressable>

        <View className="flex-row items-center gap-4">
          <Text className="text-sm text-muted-foreground">#{stats.total + 1}</Text>
          <Text className="text-sm font-semibold text-foreground">
            {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 100}%
          </Text>
        </View>

        <Pressable onPress={handleEndSession} className="active:opacity-50">
          <Text className="text-sm font-medium text-primary">{t("learningFeed.endSession")}</Text>
        </Pressable>
      </View>

      {/* Exercise counter bar */}
      <View className="flex-row items-center justify-between px-4 mb-2">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-primary" />
          <Text className="text-xs text-muted-foreground">
            {stats.correct} {t("trainingSummary.correct")?.toLowerCase()} / {stats.incorrect}{" "}
            {t("training.wrong")?.toLowerCase()}
          </Text>
        </View>
        <Text className="text-xs text-muted-foreground font-mono">
          {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
        </Text>
      </View>

      <ExerciseRouter
        exercise={currentExercise}
        isLocked={isLocked}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </View>
  );
}

function ExerciseRouter({
  exercise,
  isLocked,
  onAnswer,
  onNext,
}: {
  exercise: CurrentExercise;
  isLocked: boolean;
  onAnswer: (correct: boolean, quality: number, answer?: string) => void;
  onNext: () => void;
}) {
  const content = exercise.exerciseData as unknown as ExerciseContent;

  // Flashcard — uses Word interface, not ExerciseContent
  if (exercise.exerciseType === "flashcard") {
    const data = exercise.exerciseData;
    const word = {
      id: (data.wordId as string) || exercise.itemId,
      word: (data.word as string) || exercise.title,
      definition: (data.definition as string) || "",
      translation: (data.translation as string) || "",
      phonetic: {
        text: (data.ipa as string) || "",
        audio: (data.audioUrl as string) || "",
      },
      status: 1 as const,
      userId: "",
      createdAt: "",
      updatedAt: "",
    };

    return (
      <FlashcardCard
        word={word}
        onRate={(quality) => {
          const correct = quality >= 3;
          onAnswer(correct, quality);
          // Auto-advance after rating
          setTimeout(onNext, 300);
        }}
      />
    );
  }

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

  // Ultimate fallback
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
