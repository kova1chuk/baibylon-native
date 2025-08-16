import React from 'react';

import { useRouter } from 'expo-router';

import { View, StyleSheet, ScrollView, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { useColorScheme } from '@/hooks/useColorScheme';

import { colors } from '../../../shared/config/colors';
import { SignUpForm } from '../../../shared/types';

import { AuthForm } from './AuthForm';

export default function SignUpPage() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const themeColors = colors;

  const handleSignUp = async (formData: SignUpForm) => {
    try {
      // TODO: Implement actual sign up logic
      console.log('Sign up attempt:', formData);

      // For now, just navigate to main app
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // TODO: Implement Google Sign-Up
      console.log('Google sign up attempt');
      Alert.alert('Info', 'Google Sign-Up not implemented yet');
    } catch {
      Alert.alert('Error', 'Failed to sign up with Google. Please try again.');
    }
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? themeColors.background.page.dark
            : themeColors.background.page.light,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.formContainer}>
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: isDark
                ? themeColors.background.card.dark
                : themeColors.background.card.light,
            },
          ]}
        >
          <ThemedText type="title" style={styles.title}>
            Create your account
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Or{' '}
            <ThemedText style={styles.link} onPress={handleSignIn}>
              sign in to your existing account
            </ThemedText>
          </ThemedText>

          <AuthForm
            onSubmit={handleSignUp}
            onGoogleSignIn={handleGoogleSignUp}
            submitText="Create Account"
            googleText="Sign up with Google"
            showConfirmPassword={true}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formCard: {
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  link: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});
