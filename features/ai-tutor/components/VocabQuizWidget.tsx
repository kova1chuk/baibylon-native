import React, { useCallback, useState } from "react";

import { Check, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { View, Text, Pressable } from "react-native";

import type { QuizQuestion, QuizResult } from "../types/quiz";

interface VocabQuizWidgetProps {
  quiz: QuizQuestion;
  result?: QuizResult | null;
  onAnswer: (selectedOption: string) => void;
  isLoading?: boolean;
}

export default function VocabQuizWidget({
  quiz,
  result,
  onAnswer,
  isLoading,
}: VocabQuizWidgetProps) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = useCallback(
    (option: string) => {
      if (result || isLoading || selectedOption) return;
      setSelectedOption(option);
      onAnswer(option);
    },
    [result, isLoading, selectedOption, onAnswer],
  );

  const getDifficultyColor = () => {
    switch (quiz.difficulty) {
      case "easy":
        return "#10B981";
      case "medium":
        return "#F59E0B";
      case "hard":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  return (
    <View className="bg-card rounded-xl p-4 my-2">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs text-muted-foreground uppercase tracking-wider">
          {quiz.sourceLanguage} → {quiz.targetLanguage}
        </Text>
        <View
          className="rounded-full px-2 py-0.5"
          style={{ backgroundColor: `${getDifficultyColor()}20` }}
        >
          <Text className="text-xs font-medium" style={{ color: getDifficultyColor() }}>
            {quiz.difficulty}
          </Text>
        </View>
      </View>

      <Text className="text-lg font-semibold text-foreground mb-3">{quiz.word}</Text>

      {quiz.context && (
        <Text className="text-sm text-muted-foreground italic mb-3">{quiz.context}</Text>
      )}

      <View className="gap-2">
        {quiz.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = result && option === result.correctAnswer;
          const isWrong = result && isSelected && !result.isCorrect;

          return (
            <Pressable
              key={index}
              onPress={() => handleSelect(option)}
              disabled={!!result || isLoading}
              className="rounded-lg p-3 active:opacity-80"
              style={{
                borderWidth: 1.5,
                borderColor: isCorrect
                  ? "#10B981"
                  : isWrong
                    ? "#EF4444"
                    : isSelected
                      ? "#3B82F6"
                      : "#D1D5DB",
                backgroundColor: isCorrect
                  ? "rgba(16, 185, 129, 0.1)"
                  : isWrong
                    ? "rgba(239, 68, 68, 0.1)"
                    : "transparent",
                opacity: result && !isCorrect && !isWrong ? 0.5 : 1,
              }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground flex-1">{option}</Text>
                {isCorrect && <Check size={16} color="#10B981" />}
                {isWrong && <X size={16} color="#EF4444" />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {result && result.explanation && (
        <View className="mt-3 p-2 bg-background rounded-lg">
          <Text className="text-xs text-muted-foreground">{result.explanation}</Text>
        </View>
      )}

      {isLoading && (
        <Text className="text-xs text-muted-foreground mt-2 text-center">
          {t("learningFeed.checking")}
        </Text>
      )}
    </View>
  );
}
