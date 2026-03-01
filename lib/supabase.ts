import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import { Platform } from 'react-native';

import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

const MAX_SECURE_STORE_SIZE = 2048;

const isSSR = Platform.OS === 'web' && typeof window === 'undefined';

// SSR-safe no-op storage — real storage is only used on the client
const NoopStorage = {
  getItem: async (_key: string): Promise<string | null> => null,
  setItem: async (_key: string, _value: string): Promise<void> => {},
  removeItem: async (_key: string): Promise<void> => {},
};

function createHybridStorage() {
  // Lazy-load native modules to avoid SSR crashes
  const AsyncStorageModule =
    require('@react-native-async-storage/async-storage') as {
      default: {
        getItem: (key: string) => Promise<string | null>;
        setItem: (key: string, value: string) => Promise<void>;
        removeItem: (key: string) => Promise<void>;
      };
    };
  const SecureStore = require('expo-secure-store') as {
    getItemAsync: (key: string) => Promise<string | null>;
    setItemAsync: (key: string, value: string) => Promise<void>;
    deleteItemAsync: (key: string) => Promise<void>;
  };
  const AsyncStorage = AsyncStorageModule.default;

  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        const secureValue = await SecureStore.getItemAsync(key);
        if (secureValue) {
          return secureValue;
        }

        return await AsyncStorage.getItem(key);
      } catch {
        return await AsyncStorage.getItem(key);
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      const estimatedSize = value.length;

      if (estimatedSize <= MAX_SECURE_STORE_SIZE) {
        try {
          await SecureStore.setItemAsync(key, value);
          await AsyncStorage.removeItem(key);
          return;
        } catch (error: any) {
          if (
            error?.message?.includes('2048') ||
            estimatedSize > MAX_SECURE_STORE_SIZE
          ) {
          } else {
          }
        }
      }

      await AsyncStorage.setItem(key, value);

      try {
        await SecureStore.deleteItemAsync(key);
      } catch {}
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {}
      try {
        await AsyncStorage.removeItem(key);
      } catch {}
    },
  };
}

const storageAdapter = isSSR ? NoopStorage : createHybridStorage();

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: !isSSR,
    persistSession: !isSSR,
    detectSessionInUrl: !isSSR,
  },
});
