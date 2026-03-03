import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface FormState {
  auth: {
    email: string;
    password: string;
    confirmPassword: string;
    error: string;
    loading: boolean;
  };

  word: {
    newWord: string;
    newDefinition: string;
    newExample: string;
    submitting: boolean;
    error: string;
    selectedStatuses: number[];
    searchQuery: string;
    sortBy: string;
    sortOrder: string;
    pageSize: number;
    currentPage: number;
  };

  review: {
    title: string;
    isEditingTitle: boolean;
    isSaved: boolean;
  };

  training: {
    selectedStatuses: string[];
    trainingMode: "word" | "sentence";
  };

  filters: {
    statusFilter: string;
    currentPage: number;
    pageSize: number;
  };
}

const initialState: FormState = {
  auth: {
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    loading: false,
  },

  word: {
    newWord: "",
    newDefinition: "",
    newExample: "",
    submitting: false,
    error: "",
    selectedStatuses: [1, 2, 3, 4, 5],
    searchQuery: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    pageSize: 12,
    currentPage: 1,
  },

  review: {
    title: "",
    isEditingTitle: false,
    isSaved: false,
  },

  training: {
    selectedStatuses: ["to_learn", "want_repeat", "unset"],
    trainingMode: "word",
  },

  filters: {
    statusFilter: "all",
    currentPage: 1,
    pageSize: 12,
  },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setAuthEmail: (state, action: PayloadAction<string>) => {
      state.auth.email = action.payload;
    },
    setAuthPassword: (state, action: PayloadAction<string>) => {
      state.auth.password = action.payload;
    },
    setAuthConfirmPassword: (state, action: PayloadAction<string>) => {
      state.auth.confirmPassword = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.auth.error = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.auth.loading = action.payload;
    },
    clearAuthForm: (state) => {
      state.auth.email = "";
      state.auth.password = "";
      state.auth.confirmPassword = "";
      state.auth.error = "";
      state.auth.loading = false;
    },

    setNewWord: (state, action: PayloadAction<string>) => {
      state.word.newWord = action.payload;
    },
    setNewDefinition: (state, action: PayloadAction<string>) => {
      state.word.newDefinition = action.payload;
    },
    setNewExample: (state, action: PayloadAction<string>) => {
      state.word.newExample = action.payload;
    },
    setWordSubmitting: (state, action: PayloadAction<boolean>) => {
      state.word.submitting = action.payload;
    },
    setWordError: (state, action: PayloadAction<string>) => {
      state.word.error = action.payload;
    },
    clearWordForm: (state) => {
      state.word.newWord = "";
      state.word.newDefinition = "";
      state.word.newExample = "";
      state.word.submitting = false;
      state.word.error = "";
    },

    setReviewTitle: (state, action: PayloadAction<string>) => {
      state.review.title = action.payload;
    },
    setReviewEditingTitle: (state, action: PayloadAction<boolean>) => {
      state.review.isEditingTitle = action.payload;
    },
    setReviewSaved: (state, action: PayloadAction<boolean>) => {
      state.review.isSaved = action.payload;
    },

    setSelectedStatuses: (state, action: PayloadAction<string[]>) => {
      state.training.selectedStatuses = action.payload;
    },
    setTrainingMode: (state, action: PayloadAction<"word" | "sentence">) => {
      state.training.trainingMode = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.statusFilter = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.filters.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.filters.pageSize = action.payload;
    },

    resetAllForms: () => initialState,
  },
});

export const {} = formSlice.actions;

export default formSlice.reducer;
