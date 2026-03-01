import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { ScrollView, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

import { useColors } from '@/hooks/useColors';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = useColors();
  const primaryColor = theme === 'dark' ? '#6EE7B7' : '#10B981';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const validate = (): boolean => {
    if (password.length < 6) {
      setError(t('auth.passwordValidation'));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordsMustMatch'));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setSuccess(true);
      redirectTimerRef.current = setTimeout(() => {
        router.replace('/auth/signin');
      }, 3000);
    } catch {
      setError(t('auth.passwordValidation'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingVertical: 40,
          paddingHorizontal: 20,
        }}
      >
        <Card>
          <CardHeader>
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Check size={24} color={primaryColor} />
            </View>
            <CardTitle>
              <Text>{t('auth.passwordResetSuccess')}</Text>
            </CardTitle>
            <CardDescription>
              <Text>{t('auth.passwordResetSuccessDescription')}</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onPress={() => router.replace('/auth/signin')}>
              <Text>{t('auth.backToSignIn')}</Text>
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <Text>{t('auth.resetPasswordTitle')}</Text>
          </CardTitle>
          <CardDescription>
            <Text>{t('auth.resetPasswordDescription')}</Text>
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="gap-2">
            <Label nativeID="password">{t('auth.newPasswordLabel')}</Label>
            <Input
              value={password}
              onChangeText={text => {
                setPassword(text);
                setError(null);
              }}
              placeholder={t('auth.newPasswordPlaceholder')}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View className="gap-2">
            <Label nativeID="confirmPassword">
              {t('auth.confirmPasswordLabel')}
            </Label>
            <Input
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                setError(null);
              }}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {error && <Text className="text-sm text-destructive">{error}</Text>}
          <Button onPress={handleSubmit} disabled={loading}>
            <Text>
              {loading ? t('common.loading') : t('auth.resetPassword')}
            </Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
