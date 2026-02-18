import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';

import { View, ScrollView, ActivityIndicator } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

import { useGoogleAuth } from '@/hooks/useGoogleAuth';

import { AuthForm } from './AuthForm';

export default function SignInPage() {
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
        setError(authError.message || 'Failed to sign in. Please try again.');
      }
    } catch {
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch {
      setError('Failed to sign in with Google. Please try again.');
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
        loading={loading}
        error={error}
        onClearError={() => setError(null)}
        isGoogleLoading={googleLoading}
      />
    </ScrollView>
  );
}
