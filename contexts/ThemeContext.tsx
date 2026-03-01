import React, { createContext, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

import { Appearance } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  /** User's preference: 'system', 'light', or 'dark' */
  preference: ThemePreference;
  /** The actual resolved theme: 'light' or 'dark' */
  resolvedTheme: ResolvedTheme;
  /** Whether the resolved theme is dark */
  isDark: boolean;
  /** Set the theme preference */
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@vocairo_theme';

function isValidPreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // NativeWind's color scheme API — controls the .dark CSS class
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();

  // Load saved preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const pref: ThemePreference = isValidPreference(saved)
          ? saved
          : 'system';
        setPreferenceState(pref);
        setColorScheme(pref);
      } catch {
        // Default to system on error
        setColorScheme('system');
      } finally {
        setIsLoaded(true);
      }
    };

    loadPreference();
  }, [setColorScheme]);

  // Listen for system appearance changes when preference is 'system'
  useEffect(() => {
    if (preference !== 'system') return;

    const subscription = Appearance.addChangeListener(() => {
      // NativeWind handles this internally when set to 'system',
      // but we trigger a re-render to keep resolvedTheme in sync
      setColorScheme('system');
    });

    return () => subscription.remove();
  }, [preference, setColorScheme]);

  const setPreference = async (newPref: ThemePreference) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newPref);
      setPreferenceState(newPref);
      setColorScheme(newPref);
    } catch {
      // Silently fail — preference just won't persist
    }
  };

  const resolvedTheme: ResolvedTheme = colorScheme ?? 'light';
  const isDark = resolvedTheme === 'dark';

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ preference, resolvedTheme, isDark, setPreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
