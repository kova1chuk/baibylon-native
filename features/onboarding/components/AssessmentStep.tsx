import React, { useState } from "react";

import { AlertCircle, Check, RotateCcw } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import { useGetAssessmentQuestionsQuery, useSubmitAssessmentMutation } from "../api/onboardingApi";
import type { AssessmentResult } from "../api/onboardingApi";

const ACCENT = "#818cf8";
const CORRECT = "#6ee7b7";
const WRONG = "#f87171";
const OPTION_LABELS = ["A", "B", "C", "D"];

interface AssessmentStepProps {
  onComplete: (result: AssessmentResult) => void;
}

export default function AssessmentStep({ onComplete }: AssessmentStepProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: questions, isLoading: questionsLoading } = useGetAssessmentQuestionsQuery();
  const [submitAssessment, { isLoading: submitting }] = useSubmitAssessmentMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [submitError, setSubmitError] = useState(false);

  const handleSelect = (questionId: string, optionIndex: number, correctIndex: number) => {
    if (selectedIndex !== null) return;

    setSelectedIndex(optionIndex);
    const updatedAnswers = { ...answers, [questionId]: optionIndex };
    setAnswers(updatedAnswers);

    setTimeout(async () => {
      if (!questions) return;

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedIndex(null);
      } else {
        const payload = Object.entries(updatedAnswers).map(([questionId, selectedIndex]) => ({
          questionId,
          selectedIndex,
        }));
        try {
          setSubmitError(false);
          const res = await submitAssessment({ answers: payload }).unwrap();
          setResult(res);
        } catch {
          setSubmitError(true);
        }
      }
    }, 420);
  };

  const handleRetry = async () => {
    if (!questions) return;
    const payload = Object.entries(answers).map(([questionId, selectedIndex]) => ({
      questionId,
      selectedIndex,
    }));
    try {
      setSubmitError(false);
      const res = await submitAssessment({ answers: payload }).unwrap();
      setResult(res);
    } catch {
      setSubmitError(true);
    }
  };

  const bgColor = isDark ? "#0f0f1a" : "#f8f8ff";
  const cardBg = isDark ? "#1a1a2e" : "#ffffff";
  const textPrimary = isDark ? "#f1f1f5" : "#1a1a2e";
  const textMuted = isDark ? "#8888aa" : "#6b6b8a";
  const optionBg = isDark ? "#16213e" : "#f0f0fa";
  const borderDefault = isDark ? "#2a2a4a" : "#e0e0f0";

  if (questionsLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: bgColor }}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text className="mt-4 text-base" style={{ color: textMuted }}>
          {t("onboarding.loadingQuestions")}
        </Text>
      </View>
    );
  }

  if (submitting) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: bgColor }}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text className="mt-4 text-base" style={{ color: textMuted }}>
          {t("onboarding.calculatingLevel")}
        </Text>
      </View>
    );
  }

  if (result) {
    const levelKey = `onboarding.level${result.level}` as const;
    const levelLabel = t(levelKey, { defaultValue: t("onboarding.greatWork") });

    return (
      <View className="flex-1 px-6 pt-12 pb-8" style={{ backgroundColor: bgColor }}>
        <View
          className="flex-1 rounded-3xl p-6 items-center justify-center"
          style={{ backgroundColor: cardBg }}
        >
          <View className="rounded-2xl px-6 py-3 mb-4" style={{ backgroundColor: `${ACCENT}22` }}>
            <Text className="text-3xl font-bold" style={{ color: ACCENT }}>
              {result.level}
            </Text>
          </View>

          <Text className="text-2xl font-bold mb-2 text-center" style={{ color: textPrimary }}>
            {t("onboarding.yourLevel", { level: levelLabel })}
          </Text>

          <Text className="text-base text-center mb-8" style={{ color: textMuted }}>
            {t("onboarding.correctOf", {
              correct: result.correctCount,
              total: result.totalCount,
            })}
          </Text>

          <View className="flex-row items-center gap-2 mb-2">
            <Check color={CORRECT} size={20} />
            <Text className="text-sm" style={{ color: textMuted }}>
              {result.correctCount} / {result.totalCount}
            </Text>
          </View>
        </View>

        <Pressable
          className="rounded-2xl py-4 items-center mt-6"
          style={{ backgroundColor: ACCENT }}
          onPress={() => onComplete(result)}
        >
          <Text className="text-base font-semibold text-white">{t("onboarding.continue")}</Text>
        </Pressable>
      </View>
    );
  }

  if (submitError) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: bgColor }}
      >
        <AlertCircle color={WRONG} size={48} />
        <Text
          className="text-lg font-semibold mt-4 mb-2 text-center"
          style={{ color: textPrimary }}
        >
          {t("onboarding.somethingWentWrong")}
        </Text>
        <Pressable
          className="flex-row items-center gap-2 rounded-xl px-6 py-3 mt-4"
          style={{ backgroundColor: ACCENT }}
          onPress={handleRetry}
        >
          <RotateCcw color="#ffffff" size={18} />
          <Text className="text-base font-semibold text-white">{t("onboarding.retry")}</Text>
        </Pressable>
      </View>
    );
  }

  if (!questions || questions.length === 0) return null;

  const question = questions[currentIndex];
  const total = questions.length;
  const progress = (currentIndex + 1) / total;

  return (
    <View className="flex-1 px-6 pt-10 pb-8" style={{ backgroundColor: bgColor }}>
      <View className="mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm font-medium" style={{ color: textMuted }}>
            {t("onboarding.questionOf", {
              current: currentIndex + 1,
              total,
            })}
          </Text>
        </View>

        <View
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: borderDefault }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: ACCENT,
            }}
          />
        </View>
      </View>

      <Text
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: textMuted }}
      >
        {t("onboarding.chooseCorrectOption")}
      </Text>

      <View
        className="rounded-2xl p-5 mb-6"
        style={{
          backgroundColor: cardBg,
          borderWidth: 1,
          borderColor: borderDefault,
        }}
      >
        <Text className="text-lg font-medium leading-7" style={{ color: textPrimary }}>
          {question.sentence}
        </Text>
      </View>

      <View className="gap-3">
        {question.options.map((option, index) => {
          let borderColor = borderDefault;
          let bg = optionBg;
          let labelBg = isDark ? "#2a2a4a" : "#e8e8f8";
          let labelColor = textMuted;
          let optionTextColor = textPrimary;

          if (selectedIndex !== null) {
            if (index === question.correctIndex) {
              borderColor = CORRECT;
              bg = `${CORRECT}18`;
              labelBg = `${CORRECT}30`;
              labelColor = CORRECT;
              optionTextColor = CORRECT;
            } else if (index === selectedIndex && selectedIndex !== question.correctIndex) {
              borderColor = WRONG;
              bg = `${WRONG}18`;
              labelBg = `${WRONG}30`;
              labelColor = WRONG;
              optionTextColor = WRONG;
            }
          }

          return (
            <Pressable
              key={index}
              className="flex-row items-center rounded-2xl px-4 py-4"
              style={{
                backgroundColor: bg,
                borderWidth: 1.5,
                borderColor,
              }}
              onPress={() => handleSelect(question.id, index, question.correctIndex)}
              disabled={selectedIndex !== null}
            >
              <View
                className="w-8 h-8 rounded-lg items-center justify-center mr-4"
                style={{ backgroundColor: labelBg }}
              >
                <Text className="text-sm font-bold" style={{ color: labelColor }}>
                  {OPTION_LABELS[index]}
                </Text>
              </View>

              <Text className="flex-1 text-base" style={{ color: optionTextColor }}>
                {option}
              </Text>

              {selectedIndex !== null && index === question.correctIndex && (
                <Check color={CORRECT} size={18} />
              )}
              {selectedIndex === index && selectedIndex !== question.correctIndex && (
                <AlertCircle color={WRONG} size={18} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
