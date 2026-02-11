import { useState, useEffect } from 'react';

import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { Alert } from 'react-native';

import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      if (url.includes('auth/callback')) {
        try {
          await WebBrowser.dismissBrowser();
        } catch {}

        try {
          const hashIndex = url.indexOf('#');
          if (hashIndex !== -1) {
            const hash = url.substring(hashIndex + 1);
            const params = new URLSearchParams(hash);

            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (error) {
                console.error('Auth error:', error.message);
              }
            }
          }
        } catch (error) {
          console.error('OAuth error:', error);
        }

        setIsLoading(false);
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const promptAsync = async () => {
    try {
      setIsLoading(true);

      const redirectUrl = makeRedirectUri({
        scheme: 'baibylon',
        path: 'auth/callback',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error('OAuth error:', error.message);
        Alert.alert('Error', error.message || 'Failed to sign in with Google');
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openBrowserAsync(data.url, {
          showInRecents: true,
        });

        if (result.type === 'cancel' || result.type === 'dismiss') {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('OAuth error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return {
    promptAsync,
    isLoading,
  };
}
