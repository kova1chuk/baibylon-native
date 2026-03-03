import React, { useCallback, useState } from "react";

import { Check, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { View, Text, Pressable } from "react-native";

import type { RuleQuizContent } from "@/entities/exercise/api/exerciseApi";

interface RuleQuizCardProps {
  content: RuleQuizContent;
  onAnswer: (correct: boolean, selectedIndex: number) => void;
  onNext: () => void;
  isLocked: boolean;
}

type OptionState = "idle" | "correct" | "wrong" | "dimmed";

export default function RuleQuizCard({ content, onAnswer, onNext, isLocked }: RuleQuizCardProps) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = useCallback(
    (index: number) => {
      if (answered || isLocked) return;
      setSelectedIndex(index);
      setAnswered(true);
      const isCorrect = index === content.correctIndex;
      onAnswer(isCorrect, index);
    },
    [answered, isLocked, content.correctIndex, onAnswer],
  );

  const handleNext = useCallback(() => {
    setSelectedIndex(null);
    setAnswered(false);
    onNext();
  }, [onNext]);

  const getOptionState = (index: number): OptionState => {
    if (!answered) return "idle";
    if (index === content.correctIndex) return "correct";
    if (index === selectedIndex) return "wrong";
    return "dimmed";
  };

  const getOptionStyles = (state: OptionState) => {
    switch (state) {
      case "correct":
        return {
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
        };
      case "wrong":
        return {
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
        };
      case "dimmed":
        return {
          borderColor: "#D1D5DB",
          backgroundColor: "transparent",
          opacity: 0.4,
        };
      default:
        return {
          borderColor: "#D1D5DB",
          backgroundColor: "transparent",
        };
    }
  };

  return (
    <View className="flex-1 px-4 pt-4">
      <View className="items-center mb-2">
        <Text className="text-xs text-muted-foreground uppercase tracking-wider">
          {content.topic} · {content.category}
        </Text>
      </View>

      <View className="items-center mb-6">
        <Text className="text-lg font-semibold text-foreground text-center">
          {content.question}
        </Text>
      </View>

      <View className="gap-3">
        {content.options.map((option, index) => {
          const state = getOptionState(index);
          const styles = getOptionStyles(state);

          return (
            <Pressable
              key={index}
              onPress={() => handleSelect(index)}
              disabled={answered}
              className="rounded-xl p-4 active:opacity-80"
              style={{ borderWidth: 2, ...styles }}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-base font-medium flex-1"
                  style={{
                    color:
                      state === "correct" ? "#10B981" : state === "wrong" ? "#EF4444" : undefined,
                  }}
                >
                  {option}
                </Text>
                {state === "correct" && <Check size={20} color="#10B981" />}
                {state === "wrong" && <X size={20} color="#EF4444" />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {answered && content.explanation && (
        <View className="mt-4 p-3 bg-card rounded-xl">
          <Text className="text-sm text-muted-foreground">{content.explanation}</Text>
        </View>
      )}

      {answered && (
        <Pressable
          className="bg-primary rounded-xl py-4 items-center mt-6 active:opacity-80"
          onPress={handleNext}
        >
          <Text className="text-white font-semibold text-base">{t("learningFeed.next")}</Text>
        </Pressable>
      )}
    </View>
  );
}
