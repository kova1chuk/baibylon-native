import React, { useState } from 'react';

import Svg, { Path } from 'react-native-svg';

import { View, Pressable } from 'react-native';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (email: string, password: string) => void;
  onGoogleAuth: () => void;
  onSwitchMode: () => void;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
  isGoogleLoading?: boolean;
}

type FormErrors = {
  email?: string;
  password?: string;
};

export function AuthForm({
  mode,
  onSubmit,
  onGoogleAuth,
  onSwitchMode,
  loading,
  error,
  onClearError,
  isGoogleLoading = false,
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const isSignIn = mode === 'signin';
  const title = isSignIn ? 'Sign In' : 'Sign Up';
  const description = isSignIn ? 'Welcome back' : 'Create your account';
  const submitText = isSignIn ? 'Sign In' : 'Sign Up';
  const switchText = isSignIn
    ? "Don't have an account?"
    : 'Already have an account?';
  const switchLinkText = isSignIn ? 'Sign up' : 'Sign in';

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (loading) return;
    if (validateForm()) {
      onSubmit(email, password);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
    if (error) onClearError();
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
    if (error) onClearError();
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="items-center">
        <CardTitle>
          <Text className="text-2xl font-bold text-center">{title}</Text>
        </CardTitle>
        <CardDescription>
          <Text className="text-sm text-muted-foreground text-center">
            {description}
          </Text>
        </CardDescription>
      </CardHeader>

      <CardContent className="gap-4">
        {/* Email field */}
        <View className="gap-2">
          <Label nativeID="email">Email</Label>
          <Input
            placeholder="name@example.com"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            aria-labelledby="email"
            className={cn(errors.email && 'border-destructive')}
          />
          {errors.email && (
            <Text className="text-xs text-destructive">{errors.email}</Text>
          )}
        </View>

        {/* Password field */}
        <View className="gap-2">
          <Label nativeID="password">Password</Label>
          <Input
            placeholder="Enter your password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            autoCapitalize="none"
            aria-labelledby="password"
            className={cn(errors.password && 'border-destructive')}
          />
          {errors.password && (
            <Text className="text-xs text-destructive">{errors.password}</Text>
          )}
        </View>

        {/* Server error */}
        {error && (
          <View className="rounded-xl bg-destructive/10 p-3">
            <Text className="text-sm text-destructive text-center">
              {error}
            </Text>
          </View>
        )}

        {/* Submit button */}
        <Button
          onPress={handleSubmit}
          disabled={loading}
          className="mt-2 bg-[#10B981] active:bg-[#059669]"
        >
          <Text className="text-white font-semibold text-base">
            {loading ? 'Loading...' : submitText}
          </Text>
        </Button>

        {/* Separator */}
        <View className="flex-row items-center gap-3 my-2">
          <Separator className="flex-1" />
          <Text className="text-xs text-muted-foreground uppercase">
            or continue with
          </Text>
          <Separator className="flex-1" />
        </View>

        {/* Google OAuth */}
        <Button
          variant="outline"
          onPress={onGoogleAuth}
          disabled={isGoogleLoading || loading}
        >
          <View className="flex-row items-center gap-2">
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <Path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <Path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <Path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </Svg>
            <Text className="font-medium text-foreground">
              {isGoogleLoading ? 'Loading...' : 'Continue with Google'}
            </Text>
          </View>
        </Button>
      </CardContent>

      <CardFooter className="justify-center">
        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-muted-foreground">{switchText}</Text>
          <Pressable onPress={onSwitchMode}>
            <Text className="text-sm font-semibold text-[#10B981]">
              {switchLinkText}
            </Text>
          </Pressable>
        </View>
      </CardFooter>
    </Card>
  );
}
