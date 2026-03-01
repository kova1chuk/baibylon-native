import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isMenuOpen: boolean;
  isUserMenuOpen: boolean;

  showSettings: boolean;
  showWordInfo: boolean;
  showAddWordForm: boolean;

  isEditingTitle: boolean;
  isDragOver: boolean;

  showInstallPrompt: boolean;
  isOnline: boolean;
  isInstalled: boolean;

  notificationVisible: boolean;

  isReloading: boolean;
  isUpdating: boolean;
}

const initialState: UIState = {
  isMenuOpen: false,
  isUserMenuOpen: false,

  showSettings: false,
  showWordInfo: false,
  showAddWordForm: false,

  isEditingTitle: false,
  isDragOver: false,

  showInstallPrompt: false,
  isOnline: true,
  isInstalled: false,

  notificationVisible: false,

  isReloading: false,
  isUpdating: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
    setIsUserMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isUserMenuOpen = action.payload;
    },
    closeAllMenus: state => {
      state.isMenuOpen = false;
      state.isUserMenuOpen = false;
    },

    setShowSettings: (state, action: PayloadAction<boolean>) => {
      state.showSettings = action.payload;
    },
    setShowWordInfo: (state, action: PayloadAction<boolean>) => {
      state.showWordInfo = action.payload;
    },
    setShowAddWordForm: (state, action: PayloadAction<boolean>) => {
      state.showAddWordForm = action.payload;
    },
    closeAllModals: state => {
      state.showSettings = false;
      state.showWordInfo = false;
      state.showAddWordForm = false;
    },

    setIsEditingTitle: (state, action: PayloadAction<boolean>) => {
      state.isEditingTitle = action.payload;
    },
    setIsDragOver: (state, action: PayloadAction<boolean>) => {
      state.isDragOver = action.payload;
    },

    setShowInstallPrompt: (state, action: PayloadAction<boolean>) => {
      state.showInstallPrompt = action.payload;
    },
    setIsOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setIsInstalled: (state, action: PayloadAction<boolean>) => {
      state.isInstalled = action.payload;
    },

    setNotificationVisible: (state, action: PayloadAction<boolean>) => {
      state.notificationVisible = action.payload;
    },

    setIsReloading: (state, action: PayloadAction<boolean>) => {
      state.isReloading = action.payload;
    },
    setIsUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },
  },
});

export const {} = uiSlice.actions;

export default uiSlice.reducer;
