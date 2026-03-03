import React from "react";

import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { ActivityIndicator, Pressable, Text, View } from "react-native";

import type { GoalIntensity } from "../api/onboardingApi";
import { GOAL_OPTIONS } from "../constants";

interface ReadyStepProps {
  level: string;
  goalIntensity: GoalIntensity;
  onStart: () => void;
  isLoading: boolean;
}

export default function ReadyStep({ level, goalIntensity, onStart, isLoading }: ReadyStepProps) {
  const { t } = useTranslation();

  const goalOption = GOAL_OPTIONS.find((o) => o.value === goalIntensity) ?? GOAL_OPTIONS[0];

  return (
    <View className="flex-1 justify-between">
      <View className="items-center mb-8">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
          style={{
            borderWidth: 2,
            borderColor: "#6ee7b7",
            backgroundColor: "rgba(110,231,183,0.08)",
          }}
        >
          <Text style={{ fontSize: 38 }}>🎉</Text>
        </View>

        <Text className="text-2xl font-bold text-white text-center mb-2">
          {t("onboarding.readyTitle")}
        </Text>
        <Text className="text-base text-center" style={{ color: "rgba(255,255,255,0.55)" }}>
          {t("onboarding.readyDescription")}
        </Text>
      </View>

      <View className="flex-row gap-3 mb-8">
        <View
          className="flex-1 rounded-2xl p-4 items-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Text className="text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
            {t("onboarding.yourLevelLabel")}
          </Text>
          <Text className="text-xl font-bold text-white">{level}</Text>
        </View>

        <View
          className="flex-1 rounded-2xl p-4 items-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Text className="text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
            {t("onboarding.dailyGoalLabel")}
          </Text>
          <Text className="text-xl font-bold" style={{ color: goalOption.color }}>
            {t(goalOption.timeKey)}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onStart}
        disabled={isLoading}
        className="rounded-2xl py-4 flex-row items-center justify-center"
        style={{
          backgroundColor: isLoading ? "rgba(110,231,183,0.3)" : "#22c55e",
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text className="text-base font-semibold text-white mr-1">
              {t("onboarding.startLearning")}
            </Text>
            <ChevronRight size={18} color="#fff" />
          </>
        )}
      </Pressable>
    </View>
  );
}
