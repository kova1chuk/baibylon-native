import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { dictionaryApi } from '@/entities/dictionary/api/dictionaryApi';
import { exerciseApi } from '@/entities/exercise/api/exerciseApi';
import { favoritesApi } from '@/entities/exercise/api/favoritesApi';
import { writingApi } from '@/entities/exercise/api/writingApi';
import { grammarApi } from '@/entities/grammar/api/grammarApi';
import { irregularAdjectiveApi } from '@/entities/irregular-adjective/api/irregularAdjectiveApi';
import { irregularVerbApi } from '@/entities/irregular-verb/api/irregularVerbApi';
import {
  learningQueueApi,
  learningQueueReducer,
} from '@/entities/learning-queue';
import { multiSessionApi } from '@/entities/learning-queue/api/multiSessionApi';
import { sessionApi } from '@/entities/learning-queue/api/sessionApi';
import { phraseApi } from '@/entities/phrase/api/phraseApi';
import { reviewApi } from '@/entities/review/api/reviewApi';
import authSlice from '@/entities/user/model/authSlice';
import { wordApi } from '@/entities/word/api/wordApi';
import wordSlice from '@/entities/word/model/wordSlice';
import aiTutorReducer from '@/features/ai-tutor/model/aiTutorSlice';
import { dashboardApi } from '@/features/hub/api/dashboardApi';
import { hubApi } from '@/features/hub/api/hubApi';
import { onboardingApi } from '@/features/onboarding/api/onboardingApi';
import { accountApi } from '@/features/profile/api/accountApi';
import profileReducer from '@/features/profile/model/profileSlice';
import trainingSlice from '@/features/training/model/trainingSlice';
import { tutorApi } from '@/shared/api/tutorApi';
import formSlice from '@/shared/model/formSlice';
import uiSlice from '@/shared/model/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    word: wordSlice,
    ui: uiSlice,
    form: formSlice,
    training: trainingSlice,
    profile: profileReducer,
    learningQueue: learningQueueReducer,
    aiTutor: aiTutorReducer,

    [dictionaryApi.reducerPath]: dictionaryApi.reducer,
    [exerciseApi.reducerPath]: exerciseApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [wordApi.reducerPath]: wordApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [phraseApi.reducerPath]: phraseApi.reducer,
    [irregularAdjectiveApi.reducerPath]: irregularAdjectiveApi.reducer,
    [irregularVerbApi.reducerPath]: irregularVerbApi.reducer,
    [hubApi.reducerPath]: hubApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [grammarApi.reducerPath]: grammarApi.reducer,
    [learningQueueApi.reducerPath]: learningQueueApi.reducer,
    [tutorApi.reducerPath]: tutorApi.reducer,
    [multiSessionApi.reducerPath]: multiSessionApi.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [onboardingApi.reducerPath]: onboardingApi.reducer,
    [writingApi.reducerPath]: writingApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredActionPaths: [
          'meta.arg',
          'payload.timestamp',
          'meta.baseQueryMeta.request',
          'meta.baseQueryMeta.response',
        ],
        ignoredPaths: [
          'items.dates',
          'words.pagination.loadedPages',
          'words.words.deletedAt',
          'words.words.updatedAt',
          'words.words.createdAt',
          'words.words.definedAt',
          'words.words.translatedAt',
          'words.words.lastTrainedAt',
        ],
      },
    }).concat(
      dictionaryApi.middleware,
      exerciseApi.middleware,
      favoritesApi.middleware,
      wordApi.middleware,
      reviewApi.middleware,
      phraseApi.middleware,
      irregularAdjectiveApi.middleware,
      irregularVerbApi.middleware,
      hubApi.middleware,
      dashboardApi.middleware,
      grammarApi.middleware,
      learningQueueApi.middleware,
      tutorApi.middleware,
      multiSessionApi.middleware,
      sessionApi.middleware,
      onboardingApi.middleware,
      writingApi.middleware,
      accountApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
