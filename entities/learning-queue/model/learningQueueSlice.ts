import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { LearningItemType, LearningStage } from '../api/types';

export type ExerciseType =
  | 'flashcard'
  | 'choose-translation'
  | 'type-word'
  | 'context-fill'
  | 'fill-gap'
  | 'phrase-builder'
  | 'match-pairs'
  | 'verb-forms'
  | 'explanation-card'
  | 'error-correction'
  | 'sentence-builder'
  | 'rule-quiz'
  | 'sentence-transform'
  | 'multiple-choice'
  | 'listen-choose'
  | 'minimal-pairs'
  | 'picture-description'
  | 'reading-passage'
  | 'sentence-ordering'
  | 'verb-forms-drill'
  | 'odd-one-out'
  | 'translate-sentence'
  | 'word-formation'
  | 'irregular-sort'
  | 'cloze-test'
  | 'idiom-match'
  | 'summary-writing'
  | 'dictation'
  | 'visual-vocab';

export type SessionPhase = 'setup' | 'active' | 'summary';

export type FocusFilter = 'all' | 'words' | 'grammar' | 'errors';

export interface CurrentExercise {
  metadataId: string;
  exerciseType: ExerciseType;
  itemType: LearningItemType;
  itemId: string;
  title: string;
  level: string | null;
  stage: LearningStage;
  totalScore: number;
  exerciseData: Record<string, unknown>;
}

export interface ExerciseHistoryEntry {
  metadataId: string;
  exerciseType: ExerciseType;
  correct: boolean;
  durationMs: number;
}

export interface SessionStats {
  total: number;
  correct: number;
  incorrect: number;
  durationSeconds: number;
  totalPoints: number;
  dailyTotal: number;
  dailyTarget: number;
  lastPointsAwarded: number;
  lastStreakBonus: number;
  itemsByType: Record<string, number>;
  correctByType: Record<string, number>;
  stageProgressions: {
    metadataId: string;
    title: string;
    fromStage: LearningStage;
    toStage: LearningStage;
  }[];
}

interface LearningQueueState {
  currentIndex: number;
  completedItems: string[];
  sessionStartTime: string | null;
  isActive: boolean;

  sessionId: string | null;
  sessionPhase: SessionPhase;
  focusFilter: FocusFilter;
  currentExercise: CurrentExercise | null;
  exerciseHistory: ExerciseHistoryEntry[];
  exerciseStartTime: number | null;
  stats: SessionStats;
}

const initialState: LearningQueueState = {
  currentIndex: 0,
  completedItems: [],
  sessionStartTime: null,
  isActive: false,

  sessionId: null,
  sessionPhase: 'setup',
  focusFilter: 'all',
  currentExercise: null,
  exerciseHistory: [],
  exerciseStartTime: null,
  stats: {
    total: 0,
    correct: 0,
    incorrect: 0,
    durationSeconds: 0,
    totalPoints: 0,
    dailyTotal: 0,
    dailyTarget: 100,
    lastPointsAwarded: 0,
    lastStreakBonus: 0,
    itemsByType: {},
    correctByType: {},
    stageProgressions: [],
  },
};

const learningQueueSlice = createSlice({
  name: 'learningQueue',
  initialState,
  reducers: {
    startSession(state) {
      state.isActive = true;
      state.sessionStartTime = new Date().toISOString();
      state.currentIndex = 0;
      state.completedItems = [];
    },
    nextItem(state) {
      state.currentIndex += 1;
    },
    markItemCompleted(state, action: PayloadAction<string>) {
      state.completedItems.push(action.payload);
    },
    endSession(state) {
      state.isActive = false;
      state.sessionStartTime = null;
    },
    resetSession() {
      return initialState;
    },

    setFocusFilter(state, action: PayloadAction<FocusFilter>) {
      state.focusFilter = action.payload;
    },

    startMultiSession(
      state,
      action: PayloadAction<{
        sessionId: string;
        firstExercise: CurrentExercise | null;
      }>
    ) {
      state.sessionId = action.payload.sessionId;
      state.sessionPhase = 'active';
      state.currentExercise = action.payload.firstExercise;
      state.exerciseHistory = [];
      state.exerciseStartTime = Date.now();
      state.stats = {
        total: 0,
        correct: 0,
        incorrect: 0,
        durationSeconds: 0,
        totalPoints: 0,
        dailyTotal: 0,
        dailyTarget: 100,
        lastPointsAwarded: 0,
        lastStreakBonus: 0,
        itemsByType: {},
        correctByType: {},
        stageProgressions: [],
      };
    },

    setCurrentExercise(state, action: PayloadAction<CurrentExercise | null>) {
      state.currentExercise = action.payload;
      state.exerciseStartTime = Date.now();
    },

    recordExerciseResult(
      state,
      action: PayloadAction<{
        metadataId: string;
        exerciseType: ExerciseType;
        correct: boolean;
        durationMs: number;
        stageProgression?: {
          metadataId: string;
          title: string;
          fromStage: LearningStage;
          toStage: LearningStage;
        };
        scoring?: {
          pointsAwarded: number;
          streakBonus: number;
          dailyTotal: number;
          dailyTarget: number;
        } | null;
      }>
    ) {
      const {
        metadataId,
        exerciseType,
        correct,
        durationMs,
        stageProgression,
        scoring,
      } = action.payload;

      state.exerciseHistory.push({
        metadataId,
        exerciseType,
        correct,
        durationMs,
      });

      state.stats.total += 1;
      if (correct) {
        state.stats.correct += 1;
        state.stats.correctByType[exerciseType] =
          (state.stats.correctByType[exerciseType] || 0) + 1;
      } else {
        state.stats.incorrect += 1;
      }
      state.stats.itemsByType[exerciseType] =
        (state.stats.itemsByType[exerciseType] || 0) + 1;

      if (stageProgression) {
        state.stats.stageProgressions.push(stageProgression);
      }

      if (scoring) {
        state.stats.totalPoints += scoring.pointsAwarded;
        state.stats.dailyTotal = scoring.dailyTotal;
        state.stats.dailyTarget = scoring.dailyTarget;
        state.stats.lastPointsAwarded = scoring.pointsAwarded;
        state.stats.lastStreakBonus = scoring.streakBonus;
      }
    },

    endMultiSession(
      state,
      action: PayloadAction<{
        durationSeconds: number;
      }>
    ) {
      state.sessionPhase = 'summary';
      state.stats.durationSeconds = action.payload.durationSeconds;
      state.currentExercise = null;
    },

    resetMultiSession(state) {
      state.sessionId = null;
      state.sessionPhase = 'setup';
      state.focusFilter = 'all';
      state.currentExercise = null;
      state.exerciseHistory = [];
      state.exerciseStartTime = null;
      state.stats = { ...initialState.stats };
    },
  },
});

export const {
  startSession,
  nextItem,
  markItemCompleted,
  endSession,
  resetSession,
  setFocusFilter,
  startMultiSession,
  setCurrentExercise,
  recordExerciseResult,
  endMultiSession,
  resetMultiSession,
} = learningQueueSlice.actions;

export default learningQueueSlice.reducer;
