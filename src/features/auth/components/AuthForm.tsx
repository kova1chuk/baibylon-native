import React, { useState } from 'react';

import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { useColorScheme } from '@/hooks/useColorScheme';

import { colors } from '../../../shared/config/colors';
import { LoginForm, SignUpForm } from '../../../shared/types';

interface AuthFormProps {
  onSubmit: (formData: LoginForm | SignUpForm) => void;
  onGoogleSignIn: () => void;
  submitText: string;
  googleText: string;
  showConfirmPassword: boolean;
}

export function AuthForm({
  onSubmit,
  onGoogleSignIn,
  submitText,
  googleText,
  showConfirmPassword,
}: AuthFormProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = colors;

  const [formData, setFormData] = useState<LoginForm | SignUpForm>({
    email: '',
    password: '',
    ...(showConfirmPassword && { confirmPassword: '', name: '' }),
  });

  const [errors, setErrors] = useState<Partial<LoginForm | SignUpForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm | SignUpForm> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (showConfirmPassword && 'confirmPassword' in formData) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateFormData = (
    field: keyof LoginForm | keyof SignUpForm,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View style={styles.container}>
      {showConfirmPassword && 'name' in formData && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark
                  ? themeColors.background.secondary.dark
                  : themeColors.background.secondary.light,
                color: isDark
                  ? themeColors.text.primary.dark
                  : themeColors.text.primary.light,
                borderColor: errors.name
                  ? themeColors.error
                  : themeColors.border.light,
              },
            ]}
            placeholder="Full Name"
            placeholderTextColor={
              isDark
                ? themeColors.text.muted.dark
                : themeColors.text.muted.light
            }
            value={formData.name}
            onChangeText={value => updateFormData('name', value)}
            autoCapitalize="words"
          />
          {errors.name && (
            <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
          )}
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark
                ? themeColors.background.secondary.dark
                : themeColors.background.secondary.light,
              color: isDark
                ? themeColors.text.primary.dark
                : themeColors.text.primary.light,
              borderColor: errors.email
                ? themeColors.error
                : themeColors.border.light,
            },
          ]}
          placeholder="Email Address"
          placeholderTextColor={
            isDark ? themeColors.text.muted.dark : themeColors.text.muted.light
          }
          value={formData.email}
          onChangeText={value => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.email && (
          <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark
                ? themeColors.background.secondary.dark
                : themeColors.background.secondary.light,
              color: isDark
                ? themeColors.text.primary.dark
                : themeColors.text.primary.light,
              borderColor: errors.password
                ? themeColors.error
                : themeColors.border.light,
            },
          ]}
          placeholder="Password"
          placeholderTextColor={
            isDark ? themeColors.text.muted.dark : themeColors.text.muted.light
          }
          value={formData.password}
          onChangeText={value => updateFormData('password', value)}
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.password && (
          <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
        )}
      </View>

      {showConfirmPassword && 'confirmPassword' in formData && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark
                  ? themeColors.background.secondary.dark
                  : themeColors.background.secondary.light,
                color: isDark
                  ? themeColors.text.primary.dark
                  : themeColors.text.primary.light,
                borderColor: errors.confirmPassword
                  ? themeColors.error
                  : themeColors.border.light,
              },
            ]}
            placeholder="Confirm Password"
            placeholderTextColor={
              isDark
                ? themeColors.text.muted.dark
                : themeColors.text.muted.light
            }
            value={formData.confirmPassword}
            onChangeText={value => updateFormData('confirmPassword', value)}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.confirmPassword && (
            <ThemedText style={styles.errorText}>
              {errors.confirmPassword}
            </ThemedText>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: themeColors.button.primary.background },
        ]}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <ThemedText
          style={[
            styles.submitButtonText,
            { color: themeColors.button.primary.text },
          ]}
        >
          {submitText}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View
          style={[
            styles.dividerLine,
            {
              backgroundColor: isDark
                ? themeColors.border.dark
                : themeColors.border.light,
            },
          ]}
        />
        <ThemedText style={styles.dividerText}>or</ThemedText>
        <View
          style={[
            styles.dividerLine,
            {
              backgroundColor: isDark
                ? themeColors.border.dark
                : themeColors.border.light,
            },
          ]}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.googleButton,
          {
            borderColor: isDark
              ? themeColors.border.dark
              : themeColors.border.light,
          },
        ]}
        onPress={onGoogleSignIn}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.googleButtonText}>🔍 {googleText}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  inputContainer: {
    gap: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginLeft: 4,
  },
  submitButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.6,
  },
  googleButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
