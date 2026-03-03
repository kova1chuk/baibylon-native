import React from "react";

import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import { NATIVE_LANGUAGES } from "../constants";

const INDIGO = "#818cf8";

interface WelcomeStepProps {
  nativeLanguage: string;
  onNativeChange: (code: string) => void;
  onContinue: () => void;
  isLoading: boolean;
}

export default function WelcomeStep({
  nativeLanguage,
  onNativeChange,
  onContinue,
  isLoading,
}: WelcomeStepProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark ? "#1e1e2e" : "#ffffff";
  const cardBorder = isDark ? "#2e2e3e" : "#e5e7eb";
  const textPrimary = isDark ? "#f4f4f5" : "#18181b";
  const textSecondary = isDark ? "#a1a1aa" : "#71717a";
  const iconBg = isDark ? "rgba(129,140,248,0.15)" : "rgba(129,140,248,0.1)";
  const selectedLangBg = isDark ? "rgba(129,140,248,0.15)" : "rgba(129,140,248,0.08)";
  const disabledBg = isDark ? "#27272a" : "#f4f4f5";
  const disabledText = isDark ? "#52525b" : "#a1a1aa";

  const canContinue = nativeLanguage.length > 0;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-8">
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            backgroundColor: iconBg,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 36 }}>🌐</Text>
        </View>

        <Text
          style={{
            color: textPrimary,
            fontSize: 26,
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {t("onboarding.welcomeTitle")}
        </Text>

        <Text
          style={{
            color: textSecondary,
            fontSize: 15,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          {t("onboarding.welcomeDescription")}
        </Text>
      </View>

      <View className="mb-6">
        <Text
          style={{
            color: textSecondary,
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {t("onboarding.learningLanguageLabel")}
        </Text>

        <View
          style={{
            backgroundColor: cardBg,
            borderWidth: 2,
            borderColor: INDIGO,
            borderRadius: 14,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 24 }}>🇺🇸</Text>
            <Text style={{ color: textPrimary, fontSize: 15, fontWeight: "600" }}>
              {t("onboarding.englishOnly")}
            </Text>
          </View>
          <Check size={18} color={INDIGO} />
        </View>
      </View>

      <View className="mb-8">
        <Text
          style={{
            color: textSecondary,
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {t("onboarding.nativeLanguageLabel")}
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {NATIVE_LANGUAGES.map((lang) => {
            const isSelected = nativeLanguage === lang.code;
            return (
              <Pressable
                key={lang.code}
                onPress={() => onNativeChange(lang.code)}
                style={({ pressed }) => ({
                  width: "47%",
                  backgroundColor: isSelected ? selectedLangBg : cardBg,
                  borderWidth: 2,
                  borderColor: isSelected ? INDIGO : cardBorder,
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  opacity: pressed ? 0.75 : 1,
                })}
              >
                <Text style={{ fontSize: 22 }}>{lang.flag}</Text>
                <Text
                  style={{
                    color: isSelected ? INDIGO : textPrimary,
                    fontSize: 14,
                    fontWeight: isSelected ? "600" : "400",
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {lang.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        onPress={canContinue && !isLoading ? onContinue : undefined}
        style={({ pressed }) => ({
          backgroundColor: canContinue ? INDIGO : disabledBg,
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed && canContinue ? 0.8 : 1,
        })}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text
            style={{
              color: canContinue ? "#ffffff" : disabledText,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {t("onboarding.continue")}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
