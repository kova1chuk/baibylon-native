import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { accountApi } from '@/features/profile/api/accountApi';

interface ProfileState {
  native_language: string;
  learning_language: string;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProfileState = {
  native_language: '',
  learning_language: '',
  loading: false,
  error: null,
  success: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearSuccess: state => {
      state.success = false;
    },
    setLanguages: (
      state,
      action: PayloadAction<{ native: string; learning: string }>
    ) => {
      state.native_language = action.payload.native;
      state.learning_language = action.payload.learning;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        accountApi.endpoints.getProfile.matchFulfilled,
        (state, action) => {
          state.loading = false;
          if (action.payload) {
            state.native_language = action.payload.native_language || '';
            state.learning_language = action.payload.learning_language || '';
          }
        }
      )
      .addMatcher(accountApi.endpoints.updateLanguages.matchPending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addMatcher(
        accountApi.endpoints.updateLanguages.matchFulfilled,
        state => {
          state.loading = false;
          state.success = true;
        }
      )
      .addMatcher(
        accountApi.endpoints.updateLanguages.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            (action.error as { message?: string })?.message ||
            'Failed to save languages';
          state.success = false;
        }
      );
  },
});

export const { clearSuccess, setLanguages } = profileSlice.actions;
export default profileSlice.reducer;
