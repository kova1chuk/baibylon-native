import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

// SecureStore has a 2048 byte limit, so we use a hybrid approach:
// - Use SecureStore for small values (tokens)
// - Use AsyncStorage for larger values (full session data)
const MAX_SECURE_STORE_SIZE = 2048;

const HybridStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      // Try SecureStore first
      const secureValue = await SecureStore.getItemAsync(key);
      if (secureValue) {
        return secureValue;
      }
      // Fallback to AsyncStorage
      return await AsyncStorage.getItem(key);
    } catch {
      // If SecureStore fails, try AsyncStorage
      return await AsyncStorage.getItem(key);
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    // Estimate size (UTF-8: most characters are 1 byte, some are 2-4 bytes)
    // Using string length as approximation (most common case)
    const estimatedSize = value.length;

    if (estimatedSize <= MAX_SECURE_STORE_SIZE) {
      try {
        // Try SecureStore first for small values
        await SecureStore.setItemAsync(key, value);
        // Remove from AsyncStorage if it exists
        await AsyncStorage.removeItem(key);
        return;
      } catch (error: any) {
        // If SecureStore fails (e.g., value too large), fallback to AsyncStorage
        if (
          error?.message?.includes('2048') ||
          estimatedSize > MAX_SECURE_STORE_SIZE
        ) {
          // Value is too large, use AsyncStorage
        } else {
          // Other error, still try AsyncStorage
        }
      }
    }

    // Use AsyncStorage for large values or if SecureStore fails
    await AsyncStorage.setItem(key, value);
    // Also try to remove from SecureStore if it exists
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignore if it doesn't exist
    }
  },
  removeItem: async (key: string): Promise<void> => {
    // Remove from both stores
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignore if it doesn't exist
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignore if it doesn't exist
    }
  },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: HybridStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable to detect session from deep link URLs
  },
});
