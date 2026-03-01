import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ActivityIndicator, ScrollView, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

import { useGoogleAuth } from '@/hooks/useGoogleAuth';

import { AuthForm } from './AuthForm';

export default function SignInPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const { promptAsync, isLoading: googleLoading } = useGoogleAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session && !authLoading) {
      router.replace('/(tabs)');
    }
  }, [session, authLoading, router]);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message || t('auth.signInError'));
      }
    } catch {
      setError(t('auth.signInError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch {
      setError(t('auth.googleSignInError'));
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      <AuthForm
        mode="signin"
        onSubmit={handleSignIn}
        onGoogleAuth={handleGoogleSignIn}
        onSwitchMode={() => router.push('/auth/signup')}
        onForgotPassword={() => router.push('/auth/forgot-password')}
        loading={loading}
        error={error}
        onClearError={() => setError(null)}
        isGoogleLoading={googleLoading}
      />
    </ScrollView>
  );
}
