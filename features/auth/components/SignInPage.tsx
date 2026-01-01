import React, { useEffect } from 'react';

import { useRouter } from 'expo-router';
import { View, ScrollView, Text, YStack, XStack, Spinner } from 'tamagui';

import { Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

import { useGoogleAuth } from '@/hooks/useGoogleAuth';

import { LoginForm } from '../../../shared/types';

import { AuthForm } from './AuthForm';

export default function SignInPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const { promptAsync, isLoading: googleLoading } = useGoogleAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (session && !authLoading) {
      router.replace('/(tabs)');
    }
  }, [session, authLoading, router]);

  const handleSignIn = async (formData: LoginForm) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        Alert.alert(
          'Error',
          error.message || 'Failed to sign in. Please try again.'
        );
        return;
      }

      // Navigation will happen automatically via the useEffect above
    } catch {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch {
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    }
  };

  const handleCreateAccount = () => {
    router.push('/auth/signup');
  };

  if (authLoading) {
    return (
      <View
        flex={1}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$background"
      >
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      <YStack
        width="100%"
        maxWidth={400}
        alignSelf="center"
        backgroundColor="$background"
        padding="$6"
        borderRadius="$4"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={8}
      >
        <Text
          fontSize="$9"
          fontWeight="bold"
          textAlign="center"
          marginBottom="$2"
        >
          Sign in to your account
        </Text>

        <XStack justifyContent="center" marginBottom="$6">
          <Text fontSize="$4" textAlign="center" opacity={0.7}>
            Or{' '}
          </Text>
          <Text
            fontSize="$4"
            color="$blue10"
            textDecorationLine="underline"
            onPress={handleCreateAccount}
          >
            create a new account
          </Text>
        </XStack>

        <AuthForm
          onSubmit={handleSignIn}
          onGoogleSignIn={handleGoogleSignIn}
          submitText="Sign in"
          googleText="Sign in with Google"
          showConfirmPassword={false}
          isLoading={googleLoading}
        />
      </YStack>
    </ScrollView>
  );
}
