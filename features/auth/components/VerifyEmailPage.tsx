import React, { useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
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
import { Text } from '@/components/ui/text';

import { useColors } from '@/hooks/useColors';

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = useColors();
  const primaryColor = theme === 'dark' ? '#6EE7B7' : '#10B981';
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
    await supabase.auth.resend({ type: 'signup', email });
    setResending(false);
    setResent(true);
  };

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
      <Card className="w-full">
        <CardHeader className="items-center">
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail size={28} color={primaryColor} />
          </View>
          <CardTitle>
            <Text>{t('auth.verifyEmailTitle')}</Text>
          </CardTitle>
          <CardDescription className="mt-2 text-center">
            <Text>
              {email
                ? t('auth.verifyEmailDescriptionWithEmail', { email })
                : t('auth.verifyEmailDescription')}
            </Text>
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-4">
          <View className="rounded-lg bg-muted/50 p-4 gap-2">
            {[
              t('auth.verifyStep1'),
              t('auth.verifyStep2'),
              t('auth.verifyStep3'),
            ].map((step, index) => (
              <View key={index} className="flex-row items-start gap-2">
                <Text className="text-primary text-sm mt-0.5">
                  {index + 1}.
                </Text>
                <Text className="text-muted-foreground text-sm flex-1">
                  {step}
                </Text>
              </View>
            ))}
          </View>

          {email && (
            <View className="items-center">
              {resent ? (
                <Text className="text-primary text-sm">
                  {t('auth.verifyEmailResent')}
                </Text>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={handleResend}
                  disabled={resending}
                >
                  <Text>
                    {resending
                      ? t('common.loading')
                      : t('auth.resendVerification')}
                  </Text>
                </Button>
              )}
            </View>
          )}

          <View className="items-center">
            <Button
              variant="link"
              size="sm"
              onPress={() => router.push('/auth/signin')}
            >
              <Text>{t('auth.backToSignIn')}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
