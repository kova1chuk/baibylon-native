import React from 'react';

import { useRouter } from 'expo-router';

import { View, StyleSheet, ScrollView, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { useColorScheme } from '@/hooks/useColorScheme';

import { colors } from '../../../shared/config/colors';
import { LoginForm } from '../../../shared/types';

import { AuthForm } from './AuthForm';

export default function SignInPage() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const themeColors = colors;

  const handleSignIn = async (formData: LoginForm) => {
    try {
      // TODO: Implement actual authentication logic
      console.log('Sign in attempt:', formData);

      // For now, just navigate to main app
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implement Google Sign-In
      console.log('Google sign in attempt');
      Alert.alert('Info', 'Google Sign-In not implemented yet');
    } catch {
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    }
  };

  const handleCreateAccount = () => {
    router.push('/auth/signup');
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
            Sign in to your account
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Or{' '}
            <ThemedText style={styles.link} onPress={handleCreateAccount}>
              create a new account
            </ThemedText>
          </ThemedText>

          <AuthForm
            onSubmit={handleSignIn}
            onGoogleSignIn={handleGoogleSignIn}
            submitText="Sign in"
            googleText="Sign in with Google"
            showConfirmPassword={false}
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
