import React from "react";

import { BookOpen, Check, ChevronRight, Target, Zap } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import type { GoalIntensity } from "../api/onboardingApi";
import { GOAL_OPTIONS } from "../constants";

interface GoalStepProps {
  selected: GoalIntensity | null;
  onSelect: (v: GoalIntensity) => void;
  onContinue: () => void;
  isLoading: boolean;
}

function GoalIcon({ value, color }: { value: GoalIntensity; color: string }) {
  if (value === "casual") return <BookOpen size={22} color={color} />;
  if (value === "regular") return <Target size={22} color={color} />;
  return <Zap size={22} color={color} />;
}

export default function GoalStep({ selected, onSelect, onContinue, isLoading }: GoalStepProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-6">
        <View
          className="w-16 h-16 rounded-2xl items-center justify-center mb-5"
          style={{ backgroundColor: "rgba(245,158,11,0.12)" }}
        >
          <Text style={{ fontSize: 32 }}>🎯</Text>
        </View>

        <Text className="text-2xl font-bold text-white text-center mb-2">
          {t("onboarding.goalTitle")}
        </Text>
        <Text className="text-base text-center" style={{ color: "rgba(255,255,255,0.55)" }}>
          {t("onboarding.goalDescription")}
        </Text>
      </View>

      <View className="gap-3 mb-8">
        {GOAL_OPTIONS.map((option) => {
          const isSelected = selected === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              className="rounded-2xl p-4 flex-row items-center"
              style={{
                backgroundColor: isSelected ? option.bg : "rgba(255,255,255,0.05)",
                borderWidth: 1.5,
                borderColor: isSelected ? option.color : "rgba(255,255,255,0.08)",
              }}
            >
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{
                  backgroundColor: isSelected ? option.bg : "rgba(255,255,255,0.06)",
                }}
              >
                <GoalIcon value={option.value} color={option.color} />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-0.5">
                  <Text className="text-base font-semibold text-white">{t(option.labelKey)}</Text>
                  <Text className="text-xs font-medium" style={{ color: option.color }}>
                    {t(option.timeKey)}
                  </Text>
                </View>
                <Text className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {t(option.descKey)}
                </Text>
              </View>

              {isSelected && (
                <View
                  className="w-6 h-6 rounded-full items-center justify-center ml-2"
                  style={{ backgroundColor: option.color }}
                >
                  <Check size={14} color="#0f0f23" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={onContinue}
        disabled={!selected || isLoading}
        className="rounded-2xl py-4 flex-row items-center justify-center"
        style={{
          backgroundColor: selected && !isLoading ? "#818cf8" : "rgba(129,140,248,0.25)",
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text className="text-base font-semibold text-white mr-1">
              {t("onboarding.continue")}
            </Text>
            <ChevronRight size={18} color="#fff" />
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}
