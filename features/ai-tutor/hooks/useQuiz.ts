import { useState, useCallback, useEffect, useRef } from "react";

import type {
  QuizAnswerPayload,
  QuizDifficulty,
  QuizDirection,
  QuizErrorEvent,
  QuizQuestion,
  QuizQuestionEvent,
  QuizResult,
  QuizResultEvent,
} from "../types/quiz";

import { useSocket } from "./useSocket";

interface UseQuizOptions {
  onQuestion?: (quiz: QuizQuestion, message: string) => void;
  onResult?: (result: QuizResult, message: string) => void;
  onError?: (error: string) => void;
}

export function useQuiz(options: UseQuizOptions = {}) {
  const { onQuestion, onResult, onError } = options;

  const { isConnected, emit, on } = useSocket();

  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quizStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const handleQuestion = (data: QuizQuestionEvent) => {
      setCurrentQuiz(data.quiz);
      setQuizResult(null);
      setIsLoading(false);
      setError(null);
      quizStartTimeRef.current = Date.now();
      onQuestion?.(data.quiz, data.message);
    };

    const handleResult = (data: QuizResultEvent) => {
      setQuizResult(data.result);
      setIsLoading(false);
      quizStartTimeRef.current = null;
      onResult?.(data.result, data.message);
    };

    const handleError = (data: QuizErrorEvent) => {
      const errorMsg = data.error || data.message;
      setError(errorMsg);
      setIsLoading(false);
      onError?.(errorMsg);
    };

    const unsubQuestion = on<QuizQuestionEvent>("quiz:question", handleQuestion);
    const unsubResult = on<QuizResultEvent>("quiz:result", handleResult);
    const unsubError = on<QuizErrorEvent>("quiz:error", handleError);

    return () => {
      unsubQuestion();
      unsubResult();
      unsubError();
    };
  }, [on, onQuestion, onResult, onError]);

  const generateQuiz = useCallback(
    (direction?: QuizDirection, difficulty?: QuizDifficulty) => {
      setIsLoading(true);
      setError(null);
      setQuizResult(null);

      emit("quiz:generate", { direction, difficulty });
    },
    [emit],
  );

  const submitAnswer = useCallback(
    (selectedOption: string) => {
      if (!currentQuiz) {
        setError("No active quiz");
        return;
      }

      setIsLoading(true);
      setError(null);

      const timeSpentMs = quizStartTimeRef.current ? Date.now() - quizStartTimeRef.current : 0;

      const payload: QuizAnswerPayload = {
        quizId: currentQuiz.id,
        selectedOption,
        timeSpentMs,
      };

      emit("quiz:answer", payload);
    },
    [currentQuiz, emit],
  );

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setQuizResult(null);
    setError(null);
    setIsLoading(false);
    quizStartTimeRef.current = null;
  }, []);

  return {
    currentQuiz,
    quizResult,
    isLoading,
    error,
    isConnected,
    generateQuiz,
    submitAnswer,
    resetQuiz,
  };
}
