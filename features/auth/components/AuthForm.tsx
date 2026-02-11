import React, { useState } from 'react';

import { Button, Text, View, XStack, YStack, useTheme } from 'tamagui';

import { TextInput } from 'react-native';

import { LoginForm, SignUpForm } from '../../../shared/types';

interface AuthFormProps {
  onSubmit: (formData: LoginForm | SignUpForm) => void;
  onGoogleSignIn: () => void;
  submitText: string;
  googleText: string;
  showConfirmPassword: boolean;
  isLoading?: boolean;
}

type FormErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
};

export function AuthForm({
  onSubmit,
  onGoogleSignIn,
  submitText,
  googleText,
  showConfirmPassword,
  isLoading = false,
}: AuthFormProps) {
  const theme = useTheme();

  const [formData, setFormData] = useState<LoginForm | SignUpForm>({
    email: '',
    password: '',
    ...(showConfirmPassword && { confirmPassword: '', name: '' }),
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    if (errors[field as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  return (
    <YStack gap="$4">
      {showConfirmPassword && 'name' in formData && (
        <YStack gap="$2">
          <TextInput
            style={{
              height: 48,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              fontSize: 16,
              backgroundColor: theme.background?.get(),
              borderColor: errors.name
                ? theme.red10?.get()
                : theme.borderColor?.get(),
              color: theme.color?.get(),
            }}
            placeholder="Full Name"
            placeholderTextColor={
              theme.placeholderColor?.get() || theme.colorFocus?.get()
            }
            value={formData.name || ''}
            onChangeText={value => updateFormData('name', value)}
            autoCapitalize="words"
          />
          {errors.name && (
            <Text color="$red10" fontSize="$3">
              {errors.name}
            </Text>
          )}
        </YStack>
      )}

      <YStack gap="$2">
        <TextInput
          style={{
            height: 48,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            fontSize: 16,
            backgroundColor: theme.background?.get(),
            borderColor: errors.email
              ? theme.red10?.get()
              : theme.borderColor?.get(),
            color: theme.color?.get(),
          }}
          placeholder="Email Address"
          placeholderTextColor={
            theme.placeholderColor?.get() || theme.colorFocus?.get()
          }
          value={formData.email}
          onChangeText={value => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.email && (
          <Text color="$red10" fontSize="$3">
            {errors.email}
          </Text>
        )}
      </YStack>

      <YStack gap="$2">
        <TextInput
          style={{
            height: 48,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            fontSize: 16,
            backgroundColor: theme.background?.get(),
            borderColor: errors.password
              ? theme.red10?.get()
              : theme.borderColor?.get(),
            color: theme.color?.get(),
          }}
          placeholder="Password"
          placeholderTextColor={
            theme.placeholderColor?.get() || theme.colorFocus?.get()
          }
          value={formData.password}
          onChangeText={value => updateFormData('password', value)}
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.password && (
          <Text color="$red10" fontSize="$3">
            {errors.password}
          </Text>
        )}
      </YStack>

      {showConfirmPassword && 'confirmPassword' in formData && (
        <YStack gap="$2">
          <TextInput
            style={{
              height: 48,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              fontSize: 16,
              backgroundColor: theme.background?.get(),
              borderColor: errors.confirmPassword
                ? theme.red10?.get()
                : theme.borderColor?.get(),
              color: theme.color?.get(),
            }}
            placeholder="Confirm Password"
            placeholderTextColor={
              theme.placeholderColor?.get() || theme.colorFocus?.get()
            }
            value={formData.confirmPassword || ''}
            onChangeText={value => updateFormData('confirmPassword', value)}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.confirmPassword && (
            <Text color="$red10" fontSize="$3">
              {errors.confirmPassword}
            </Text>
          )}
        </YStack>
      )}

      <Button
        onPress={handleSubmit}
        theme="active"
        size="$4"
        backgroundColor="$blue10"
        color="white"
        fontWeight="600"
      >
        {submitText}
      </Button>

      <XStack alignItems="center" gap="$3" marginVertical="$4">
        <View flex={1} height={1} backgroundColor="$borderColor" />
        <Text fontSize="$3" opacity={0.6}>
          or
        </Text>
        <View flex={1} height={1} backgroundColor="$borderColor" />
      </XStack>

      <Button
        onPress={onGoogleSignIn}
        disabled={isLoading}
        size="$4"
        borderColor="$borderColor"
        backgroundColor="transparent"
        borderWidth={1}
        opacity={isLoading ? 0.6 : 1}
      >
        {isLoading ? '⏳ Loading...' : `🔍 ${googleText}`}
      </Button>
    </YStack>
  );
}
