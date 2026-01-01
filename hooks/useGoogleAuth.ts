import { useState, useEffect } from 'react';

import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { Alert } from 'react-native';

import { supabase } from '@/lib/supabase';

// Complete the auth session when returning from OAuth
WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);

  // Handle deep link callback from Supabase OAuth
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      // Check if this is a Supabase OAuth callback
      if (url.includes('auth/callback')) {
        // Close the browser automatically
        try {
          await WebBrowser.dismissBrowser();
        } catch {
          // Browser might already be closed, ignore error
        }

        try {
          // Extract the URL fragment (everything after #)
          const hashIndex = url.indexOf('#');
          if (hashIndex !== -1) {
            const hash = url.substring(hashIndex + 1);
            const params = new URLSearchParams(hash);

            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
              // Set the session explicitly
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

    // Listen for deep links
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Check if app was opened via deep link
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

      // Get the redirect URI for deep linking back to the app
      const redirectUrl = makeRedirectUri({
        scheme: 'baibylon',
        path: 'auth/callback',
      });

      // Use Supabase's built-in OAuth method
      // Set skipBrowserRedirect to true so we can handle the redirect manually
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, // We'll handle the browser redirect manually
        },
      });

      if (error) {
        console.error('OAuth error:', error.message);
        Alert.alert('Error', error.message || 'Failed to sign in with Google');
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        // Open the OAuth URL in the browser
        // After authentication, Google will redirect to Supabase
        // Supabase will then redirect to our deep link (baibylon://auth/callback)
        const result = await WebBrowser.openBrowserAsync(data.url, {
          // This ensures the browser closes and redirects to the app
          showInRecents: true,
        });

        // If user cancelled or closed browser
        if (result.type === 'cancel' || result.type === 'dismiss') {
          setIsLoading(false);
        }
        // If browser was closed (user completed auth), the deep link will handle it
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
