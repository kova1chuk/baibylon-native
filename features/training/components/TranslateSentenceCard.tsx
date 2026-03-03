import React, { useCallback, useState } from "react";

import { useTranslation } from "react-i18next";

import { Pressable, Text, TextInput, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import type { TranslateSentenceContent } from "@/entities/exercise/api/exerciseApi";

interface TranslateSentenceCardProps {
  content: TranslateSentenceContent;
  onAnswer: (correct: boolean, userTranslation: string) => void;
  onNext: () => void;
  isLocked: boolean;
}

export default function TranslateSentenceCard({
  content,
  onAnswer,
  onNext,
  isLocked,
}: TranslateSentenceCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim() || submitted || isLocked) return;

    const normalized = inputValue.trim().toLowerCase();
    const correct =
      normalized === content.correctAnswer.trim().toLowerCase() ||
      content.acceptableAnswers.some((a) => a.trim().toLowerCase() === normalized);

    setSubmitted(true);
    setIsCorrect(correct);
    onAnswer(correct, inputValue.trim());
  }, [inputValue, submitted, isLocked, content.correctAnswer, content.acceptableAnswers, onAnswer]);

  const handleNext = useCallback(() => {
    setInputValue("");
    setSubmitted(false);
    setIsCorrect(false);
    onNext();
  }, [onNext]);

  return (
    <View className="flex-1 px-4 pt-4">
      <View className="items-center mb-6">
        <Text className="text-sm text-muted-foreground mb-2">
          {t("learningFeed.translateSentence")}
        </Text>
        <Text className="text-xl font-semibold text-foreground text-center">
          {content.nativeTranslation}
        </Text>
        {content.nativeDefinition && (
          <Text className="text-sm text-muted-foreground mt-2 text-center">
            {content.nativeDefinition}
          </Text>
        )}
      </View>

      <View className="mb-4">
        <TextInput
          className="bg-card border-2 rounded-xl px-4 py-4 text-center text-xl font-semibold text-foreground"
          style={{
            borderColor: submitted
              ? isCorrect
                ? "#10B981"
                : "#EF4444"
              : isDark
                ? "#27272A"
                : "#E7E5E4",
          }}
          placeholder={t("learningFeed.yourSentence")}
          placeholderTextColor={isDark ? "#52525B" : "#A1A1AA"}
          value={inputValue}
          onChangeText={setInputValue}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!submitted}
          onSubmitEditing={handleSubmit}
          multiline
        />
      </View>

      {submitted && !isCorrect && (
        <View className="mb-4 p-3 bg-card rounded-xl">
          <Text className="text-sm text-muted-foreground">{t("learningFeed.correctAnswer")}</Text>
          <Text className="text-base font-semibold text-foreground mt-1">
            {content.correctAnswer}
          </Text>
        </View>
      )}

      {!submitted ? (
        <Pressable
          className="bg-primary rounded-xl py-4 items-center active:opacity-80"
          onPress={handleSubmit}
          disabled={!inputValue.trim()}
          style={{ opacity: inputValue.trim() ? 1 : 0.5 }}
        >
          <Text className="text-white font-semibold text-base">{t("learningFeed.check")}</Text>
        </Pressable>
      ) : (
        <Pressable
          className="bg-primary rounded-xl py-4 items-center active:opacity-80"
          onPress={handleNext}
        >
          <Text className="text-white font-semibold text-base">{t("learningFeed.next")}</Text>
        </Pressable>
      )}
    </View>
  );
}
