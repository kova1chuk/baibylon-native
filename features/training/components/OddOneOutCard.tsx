import React, { useCallback, useState } from "react";

import { Check, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Pressable, Text, View } from "react-native";

import type { OddOneOutContent } from "@/entities/exercise/api/exerciseApi";

interface OddOneOutCardProps {
  content: OddOneOutContent;
  onAnswer: (correct: boolean, selectedIndex: number) => void;
  onNext: () => void;
  isLocked: boolean;
}

export default function OddOneOutCard({ content, onAnswer, onNext, isLocked }: OddOneOutCardProps) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = useCallback(
    (index: number) => {
      if (answered || isLocked) return;
      setSelectedIndex(index);
      setAnswered(true);
      const isCorrect = index === content.oddIndex;
      onAnswer(isCorrect, index);
    },
    [answered, isLocked, content.oddIndex, onAnswer],
  );

  const handleNext = useCallback(() => {
    setSelectedIndex(null);
    setAnswered(false);
    onNext();
  }, [onNext]);

  const getOptionState = (index: number) => {
    if (!answered) return "idle";
    if (index === content.oddIndex) return "correct";
    if (index === selectedIndex) return "wrong";
    return "dimmed";
  };

  const getOptionStyles = (state: string) => {
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
      <View className="items-center mb-6">
        <Text className="text-sm text-muted-foreground mb-2">{t("exercises.oddOneOut")}</Text>
        <Text className="text-base text-muted-foreground text-center">{content.category}</Text>
      </View>

      <View className="gap-3">
        {content.words.map((word, index) => {
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
                  {word}
                </Text>
                {state === "correct" && <Check size={20} color="#10B981" />}
                {state === "wrong" && <X size={20} color="#EF4444" />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {answered && (
        <View className="mt-4 p-3 bg-card rounded-xl">
          <Text className="text-sm text-muted-foreground">{content.definition}</Text>
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
