import React, { useState } from "react";

import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Pressable, ScrollView, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";

import { useColors } from "@/hooks/useColors";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = useColors();
  const primaryColor = theme === "dark" ? "#6EE7B7" : "#10B981";
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async () => {
    setValidationError(null);
    setServerError(null);

    if (!isValidEmail(email)) {
      setValidationError(t("auth.emailValidation"));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setServerError(error.message);
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError(t("auth.emailValidation"));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingVertical: 40,
          paddingHorizontal: 20,
        }}
      >
        <Card>
          <CardHeader>
            <View className="items-center mb-4">
              <Mail size={48} color={primaryColor} />
            </View>
            <CardTitle>
              <Text>{t("auth.checkYourEmail")}</Text>
            </CardTitle>
            <CardDescription>
              <Text>{t("auth.resetEmailSent")}</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Pressable onPress={() => router.push("/auth/signin")}>
              <Text className="text-center text-sm text-primary">{t("auth.backToSignIn")}</Text>
            </Pressable>
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
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <Text>{t("auth.forgotPasswordTitle")}</Text>
          </CardTitle>
          <CardDescription>
            <Text>{t("auth.forgotPasswordDescription")}</Text>
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="gap-2">
            <Label nativeID="email">{t("auth.emailLabel")}</Label>
            <Input
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setValidationError(null);
                setServerError(null);
              }}
              placeholder={t("auth.emailPlaceholder")}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {validationError && <Text className="text-sm text-destructive">{validationError}</Text>}
            {serverError && <Text className="text-sm text-destructive">{serverError}</Text>}
          </View>

          <Button onPress={handleSubmit} disabled={loading}>
            <Text>{loading ? t("common.loading") : t("auth.sendResetLink")}</Text>
          </Button>

          <Pressable onPress={() => router.push("/auth/signin")}>
            <Text className="text-center text-sm text-muted-foreground">
              {t("auth.backToSignIn")}
            </Text>
          </Pressable>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
