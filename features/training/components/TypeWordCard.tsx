import React, { useCallback, useState } from "react";

import { Eye } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { View, Text, TextInput, Pressable } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import type { TypeTheWordContent } from "@/entities/exercise/api/exerciseApi";

interface TypeWordCardProps {
  content: TypeTheWordContent;
  onAnswer: (correct: boolean, typedWord: string) => void;
  onNext: () => void;
  isLocked: boolean;
}

export default function TypeWordCard({ content, onAnswer, onNext, isLocked }: TypeWordCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim() || submitted || isLocked) return;
    const correct = inputValue.trim().toLowerCase() === content.correctAnswer.trim().toLowerCase();
    setSubmitted(true);
    setIsCorrect(correct);
    onAnswer(correct, inputValue.trim());
  }, [inputValue, submitted, isLocked, content.correctAnswer, onAnswer]);

  const handleNext = useCallback(() => {
    setInputValue("");
    setSubmitted(false);
    setIsCorrect(false);
    setHintRevealed(false);
    onNext();
  }, [onNext]);

  return (
    <View className="flex-1 px-4 pt-4">
      <View className="items-center mb-6">
        <Text className="text-sm text-muted-foreground mb-2">{content.prompt}</Text>
        <Text className="text-xl font-semibold text-foreground text-center">
          {content.translation}
        </Text>
        {content.definition && (
          <Text className="text-sm text-muted-foreground mt-2 text-center">
            {content.definition}
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
          placeholder={t("learningFeed.typeWord")}
          placeholderTextColor={isDark ? "#52525B" : "#A1A1AA"}
          value={inputValue}
          onChangeText={setInputValue}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!submitted}
          onSubmitEditing={handleSubmit}
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

      {!submitted && content.hint && (
        <View className="mb-4">
          {hintRevealed ? (
            <View className="p-3 bg-card rounded-xl">
              <Text className="text-sm text-muted-foreground">{content.hint}</Text>
            </View>
          ) : (
            <Pressable
              className="flex-row items-center justify-center gap-2 py-2 active:opacity-50"
              onPress={() => setHintRevealed(true)}
            >
              <Eye size={16} color={isDark ? "#A1A1AA" : "#6B7280"} />
              <Text className="text-sm text-muted-foreground">{t("aiTutor.hint")}</Text>
            </Pressable>
          )}
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
