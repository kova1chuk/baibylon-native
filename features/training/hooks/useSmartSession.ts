import { useCallback, useEffect, useRef, useState } from "react";

import type { UnifiedQueueItem } from "@/entities/dictionary/api/types";

export type SmartSessionPhase = "idle" | "active" | "summary";

export interface ItemResult {
  correct: boolean;
  quality: number;
  answer?: string;
}

interface UseSmartSessionInput {
  items: UnifiedQueueItem[];
  onSubmitResult?: (item: UnifiedQueueItem, correct: boolean, quality: number) => void;
  onNeedMoreItems?: () => void;
}

export function useSmartSession({ items, onSubmitResult, onNeedMoreItems }: UseSmartSessionInput) {
  const [phase, setPhase] = useState<SmartSessionPhase>("idle");
  const [sessionItems, setSessionItems] = useState<UnifiedQueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Map<string, ItemResult>>(new Map());
  const [isLocked, setIsLocked] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [streakCurrent, setStreakCurrent] = useState(0);
  const [streakBest, setStreakBest] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const start = useCallback(
    (subset?: UnifiedQueueItem[]) => {
      const toUse = subset || items;
      if (toUse.length === 0) return;
      setSessionItems([...toUse]);
      setCurrentIndex(0);
      setResults(new Map());
      setIsLocked(false);
      setStreakCurrent(0);
      setStreakBest(0);
      setPhase("active");
      startTimer();
    },
    [items, startTimer],
  );

  const addItems = useCallback((newItems: UnifiedQueueItem[]) => {
    setSessionItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.metadataId));
      const unique = newItems.filter((i) => !existingIds.has(i.metadataId));
      return [...prev, ...unique];
    });
  }, []);

  const submitAnswer = useCallback(
    (correct: boolean, quality: number, answer?: string) => {
      if (phase !== "active" || isLocked) return;
      const item = sessionItems[currentIndex];
      if (!item) return;

      setIsLocked(true);

      setResults((prev) => {
        const next = new Map(prev);
        next.set(item.metadataId, { correct, quality, answer });
        return next;
      });

      if (correct) {
        setStreakCurrent((prev) => {
          const next = prev + 1;
          setStreakBest((best) => Math.max(best, next));
          return next;
        });
      } else {
        setStreakCurrent(0);
      }

      onSubmitResult?.(item, correct, quality);
    },
    [phase, isLocked, sessionItems, currentIndex, onSubmitResult],
  );

  const nextItem = useCallback(() => {
    if (phase !== "active") return;
    setIsLocked(false);

    if (currentIndex < sessionItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);

      const remaining = sessionItems.length - 1 - currentIndex;
      if (remaining <= 5 && onNeedMoreItems) {
        onNeedMoreItems();
      }
    } else if (onNeedMoreItems) {
      onNeedMoreItems();
    } else {
      stopTimer();
      setPhase("summary");
    }
  }, [phase, currentIndex, sessionItems.length, stopTimer, onNeedMoreItems]);

  const endSession = useCallback(() => {
    if (phase !== "active") return;
    stopTimer();
    setPhase("summary");
  }, [phase, stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    setPhase("idle");
    setSessionItems([]);
    setCurrentIndex(0);
    setResults(new Map());
    setIsLocked(false);
    setElapsedSeconds(0);
    setStreakCurrent(0);
    setStreakBest(0);
  }, [stopTimer]);

  const retryMistakes = useCallback(() => {
    const mistakes = sessionItems.filter((item) => {
      const result = results.get(item.metadataId);
      return result && !result.correct;
    });
    if (mistakes.length === 0) return;
    start(mistakes);
  }, [sessionItems, results, start]);

  const currentItem = sessionItems[currentIndex] ?? null;

  const resultValues = Array.from(results.values());
  const correctCount = resultValues.filter((r) => r.correct).length;
  const wrongCount = resultValues.filter((r) => !r.correct).length;
  const accuracy =
    resultValues.length > 0 ? Math.round((correctCount / resultValues.length) * 100) : 0;

  const typeCounts = sessionItems.reduce(
    (acc, item) => {
      acc[item.itemType] = (acc[item.itemType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const completedCount = results.size;

  return {
    phase,
    sessionItems,
    currentIndex,
    currentItem,
    results,
    isLocked,
    elapsedSeconds,
    streakCurrent,
    streakBest,
    completedCount,
    stats: {
      total: completedCount,
      correct: correctCount,
      wrong: wrongCount,
      accuracy,
      typeCounts,
    },
    start,
    addItems,
    submitAnswer,
    nextItem,
    endSession,
    reset,
    retryMistakes,
  };
}
