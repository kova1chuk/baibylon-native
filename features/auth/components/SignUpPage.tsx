import React, { useEffect } from 'react';

import { useRouter } from 'expo-router';
import { View, ScrollView, Text, YStack, XStack, Spinner } from 'tamagui';

import { Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

import { useGoogleAuth } from '@/hooks/useGoogleAuth';

import { LoginForm, SignUpForm } from '../../../shared/types';

import { AuthForm } from './AuthForm';

export default function SignUpPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const { promptAsync, isLoading: googleLoading } = useGoogleAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (session && !authLoading) {
      router.replace('/(tabs)');
    }
  }, [session, authLoading, router]);

  const handleSignUp = async (formData: SignUpForm | LoginForm) => {
    if (!('confirmPassword' in formData)) {
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        Alert.alert(
          'Error',
          error.message || 'Failed to create account. Please try again.'
        );
        return;
      }

      // Navigation will happen automatically via the useEffect above
      // Note: Supabase may require email confirmation depending on your settings
    } catch {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // Google auth automatically creates a user if they don't exist
      // Same flow as sign-in, just different UI text
      await promptAsync();
    } catch {
      Alert.alert('Error', 'Failed to sign up with Google. Please try again.');
    }
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
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
          Create your account
        </Text>

        <XStack justifyContent="center" marginBottom="$6">
          <Text fontSize="$4" textAlign="center" opacity={0.7}>
            Or{' '}
          </Text>
          <Text
            fontSize="$4"
            color="$blue10"
            textDecorationLine="underline"
            onPress={handleSignIn}
          >
            sign in to your existing account
          </Text>
        </XStack>

        <AuthForm
          onSubmit={handleSignUp}
          onGoogleSignIn={handleGoogleSignUp}
          submitText="Create Account"
          googleText="Sign up with Google"
          showConfirmPassword={true}
          isLoading={googleLoading}
        />
      </YStack>
    </ScrollView>
  );
}
