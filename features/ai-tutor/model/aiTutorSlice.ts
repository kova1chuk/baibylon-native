import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SessionWord {
  word: string;
  base: string;
  correct: boolean;
}

export type TutorMode = 'adaptive' | 'free-talk' | 'grammar';

interface SessionStats {
  correctCount: number;
  totalCount: number;
  accuracy: number;
  streak: number;
  startedAt: string | null;
  elapsedMinutes: number;
}

interface AiTutorState {
  currentSessionId: string | null;
  view: 'welcome' | 'chat';
  selectedChatId: string | null;
  sessionStats: SessionStats;
  sessionWords: SessionWord[];
  mode: TutorMode;
  preferences: {
    enableSuggestions: boolean;
    autoCorrect: boolean;
    showTranslations: boolean;
    difficulty: string;
    sessionLength: number;
  };
}

const initialState: AiTutorState = {
  currentSessionId: null,
  view: 'welcome',
  selectedChatId: null,
  sessionStats: {
    correctCount: 0,
    totalCount: 0,
    accuracy: 0,
    streak: 0,
    startedAt: null,
    elapsedMinutes: 0,
  },
  sessionWords: [],
  mode: 'adaptive',
  preferences: {
    enableSuggestions: true,
    autoCorrect: true,
    showTranslations: true,
    difficulty: 'adaptive',
    sessionLength: 10,
  },
};

const aiTutorSlice = createSlice({
  name: 'aiTutor',
  initialState,
  reducers: {
    setView(state, action: PayloadAction<'welcome' | 'chat'>) {
      state.view = action.payload;
    },
    setMode(state, action: PayloadAction<TutorMode>) {
      state.mode = action.payload;
    },
    setSelectedChatId(state, action: PayloadAction<string | null>) {
      state.selectedChatId = action.payload;
    },
    startSession(state, action: PayloadAction<string>) {
      state.currentSessionId = action.payload;
      state.sessionStats = {
        correctCount: 0,
        totalCount: 0,
        accuracy: 0,
        streak: 0,
        startedAt: new Date().toISOString(),
        elapsedMinutes: 0,
      };
      state.sessionWords = [];
      state.view = 'chat';
    },
    endSession(state) {
      state.currentSessionId = null;
      state.sessionStats = { ...initialState.sessionStats };
      state.sessionWords = [];
    },
    recordQuizResult(
      state,
      action: PayloadAction<{
        correct: boolean;
        word?: string;
        base?: string;
      }>
    ) {
      const { correct, word, base } = action.payload;
      state.sessionStats.totalCount += 1;
      if (correct) {
        state.sessionStats.correctCount += 1;
        state.sessionStats.streak += 1;
      } else {
        state.sessionStats.streak = 0;
      }
      state.sessionStats.accuracy =
        state.sessionStats.totalCount > 0
          ? Math.round(
              (state.sessionStats.correctCount /
                state.sessionStats.totalCount) *
                100
            )
          : 0;

      if (word) {
        state.sessionWords.push({
          word,
          base: base || word,
          correct,
        });
      }
    },
    updateElapsedMinutes(state, action: PayloadAction<number>) {
      state.sessionStats.elapsedMinutes = action.payload;
    },
    setPreference(
      state,
      action: PayloadAction<{
        key: keyof AiTutorState['preferences'];
        value: boolean | string | number;
      }>
    ) {
      const { key, value } = action.payload;
      (state.preferences as Record<string, unknown>)[key] = value;
    },
    setAllPreferences(
      state,
      action: PayloadAction<Partial<AiTutorState['preferences']>>
    ) {
      Object.assign(state.preferences, action.payload);
    },
    resetSession(state) {
      state.sessionStats = { ...initialState.sessionStats };
      state.sessionWords = [];
      state.currentSessionId = null;
    },
  },
});

export const {
  setView,
  setMode,
  setSelectedChatId,
  startSession,
  endSession,
  recordQuizResult,
  updateElapsedMinutes,
  setPreference,
  setAllPreferences,
  resetSession,
} = aiTutorSlice.actions;

export default aiTutorSlice.reducer;
