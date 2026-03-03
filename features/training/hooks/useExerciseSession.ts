import { useCallback, useRef, useState } from "react";

import {
  useAbandonExerciseSessionMutation,
  useBatchExerciseQuestionsMutation,
  useCompleteExerciseSessionMutation,
  useStartExerciseSessionMutation,
  useSubmitExerciseAnswerMutation,
} from "@/entities/exercise/api/exerciseApi";

import type { ExerciseQuestion, SubmitAnswerResult } from "@/entities/exercise/api/exerciseApi";

export type ExerciseSessionPhase = "idle" | "loading" | "active" | "summary";

type ExerciseType =
  | "MULTIPLE_CHOICE"
  | "CONTEXT_FILL"
  | "TYPE_THE_WORD"
  | "ODD_ONE_OUT"
  | "WORD_FORMATION"
  | "VERB_FORMS_DRILL"
  | "RULE_QUIZ"
  | "ERROR_CORRECTION"
  | "SENTENCE_TRANSFORM"
  | "CLOZE_TEST"
  | "PHRASE_BUILDER"
  | "SENTENCE_ORDERING"
  | "READING_PASSAGE"
  | "TRANSLATE_SENTENCE"
  | "WRITE_SENTENCE";

type AnswerPayload =
  | { selectedIndex: number }
  | { selectedOption: string }
  | { typedWord: string }
  | { v2: string; v3: string }
  | { selectedWordIdx: number; userCorrection: string }
  | { userSentence: string }
  | { blanks: Record<string, string> }
  | { arrangedWords: string[] }
  | { userOrder: number[] }
  | { answers: Record<string, number | boolean> }
  | { userTranslation: string };

export interface ExerciseSessionStats {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
}

export function useExerciseSession() {
  const [phase, setPhase] = useState<ExerciseSessionPhase>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ExerciseQuestion | null>(null);
  const [questionQueue, setQuestionQueue] = useState<ExerciseQuestion[]>([]);
  const [stats, setStats] = useState<ExerciseSessionStats>({
    total: 0,
    correct: 0,
    wrong: 0,
    accuracy: 0,
  });
  const [lastResult, setLastResult] = useState<SubmitAnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startTimeRef = useRef<number>(0);
  const questionStartRef = useRef<number>(0);

  const [startSession] = useStartExerciseSessionMutation();
  const [submitAnswer] = useSubmitExerciseAnswerMutation();
  const [batchQuestions] = useBatchExerciseQuestionsMutation();
  const [completeSession] = useCompleteExerciseSessionMutation();
  const [abandonSession] = useAbandonExerciseSessionMutation();

  const start = useCallback(
    async (exerciseType: ExerciseType) => {
      setPhase("loading");
      try {
        const result = await startSession({ exerciseType }).unwrap();
        setSessionId(result.sessionId);
        setCurrentQuestion(result.question);
        setStats({ total: 0, correct: 0, wrong: 0, accuracy: 0 });
        setLastResult(null);
        startTimeRef.current = Date.now();
        questionStartRef.current = Date.now();
        setPhase("active");

        // Pre-fetch next batch
        try {
          const batch = await batchQuestions({
            sessionId: result.sessionId,
            count: 5,
          }).unwrap();
          setQuestionQueue(batch.questions);
        } catch {
          // Non-critical — we can still proceed with nextQuestion from submit
        }
      } catch {
        setPhase("idle");
      }
    },
    [startSession, batchQuestions],
  );

  const submit = useCallback(
    async (answer: AnswerPayload) => {
      if (!sessionId || !currentQuestion || isSubmitting) return null;

      setIsSubmitting(true);
      const timeSpentMs = Date.now() - questionStartRef.current;

      try {
        const result = await submitAnswer({
          sessionId,
          questionId: currentQuestion.id,
          answer,
          timeSpentMs,
        }).unwrap();

        setLastResult(result.result);

        const newTotal = stats.total + 1;
        const newCorrect = stats.correct + (result.result.isCorrect ? 1 : 0);
        const newWrong = stats.wrong + (result.result.isCorrect ? 0 : 1);
        setStats({
          total: newTotal,
          correct: newCorrect,
          wrong: newWrong,
          accuracy: newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0,
        });

        // Queue the next question
        if (result.nextQuestion) {
          setQuestionQueue((prev) => [...prev, result.nextQuestion!]);
        }

        return result.result;
      } catch {
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [sessionId, currentQuestion, isSubmitting, stats, submitAnswer],
  );

  const next = useCallback(() => {
    if (questionQueue.length > 0) {
      const [nextQ, ...rest] = questionQueue;
      setCurrentQuestion(nextQ);
      setQuestionQueue(rest);
      setLastResult(null);
      questionStartRef.current = Date.now();
    } else {
      // No more questions — end session
      setPhase("summary");
      if (sessionId) {
        completeSession({ sessionId }).catch(() => {});
      }
    }
  }, [questionQueue, sessionId, completeSession]);

  const end = useCallback(async () => {
    setPhase("summary");
    if (sessionId) {
      try {
        await completeSession({ sessionId }).unwrap();
      } catch {
        // Session already ended or error — proceed to summary
      }
    }
  }, [sessionId, completeSession]);

  const abandon = useCallback(async () => {
    if (sessionId) {
      try {
        await abandonSession({ sessionId }).unwrap();
      } catch {
        // Ignore
      }
    }
    setPhase("idle");
    setSessionId(null);
    setCurrentQuestion(null);
    setQuestionQueue([]);
    setStats({ total: 0, correct: 0, wrong: 0, accuracy: 0 });
    setLastResult(null);
  }, [sessionId, abandonSession]);

  const reset = useCallback(() => {
    setPhase("idle");
    setSessionId(null);
    setCurrentQuestion(null);
    setQuestionQueue([]);
    setStats({ total: 0, correct: 0, wrong: 0, accuracy: 0 });
    setLastResult(null);
  }, []);

  const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

  return {
    phase,
    sessionId,
    currentQuestion,
    currentContent: currentQuestion?.content ?? null,
    stats,
    lastResult,
    isSubmitting,
    elapsedSeconds,
    hasMoreQuestions: questionQueue.length > 0,
    start,
    submit,
    next,
    end,
    abandon,
    reset,
  };
}
