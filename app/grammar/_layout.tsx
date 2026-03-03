import React from "react";

import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/contexts/ThemeContext";

export default function GrammarLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#0A0A0F" : "#FAF9F6",
        },
        headerTintColor: isDark ? "#FAFAF9" : "#111827",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: t("grammarPage.title") }} />
      <Stack.Screen name="level/[levelCode]" options={{ title: "" }} />
      <Stack.Screen name="topic/[topicId]" options={{ title: "" }} />
    </Stack>
  );
}
