import React, { useCallback, useState } from "react";

import { RotateCcw } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { View, Text, Pressable, ScrollView } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import type { PhraseBuilderContent } from "@/entities/exercise/api/exerciseApi";

interface PhraseBuilderCardProps {
  content: PhraseBuilderContent;
  onAnswer: (correct: boolean, arrangedWords: string[]) => void;
  onNext: () => void;
  isLocked: boolean;
}

export default function PhraseBuilderCard({
  content,
  onAnswer,
  onNext,
  isLocked,
}: PhraseBuilderCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([...content.scrambledWords]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleWordTap = useCallback(
    (word: string, fromAvailable: boolean) => {
      if (submitted || isLocked) return;

      if (fromAvailable) {
        setAvailableWords((prev) => {
          const idx = prev.indexOf(word);
          if (idx === -1) return prev;
          return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        });
        setSelectedWords((prev) => [...prev, word]);
      } else {
        setSelectedWords((prev) => {
          const idx = prev.indexOf(word);
          if (idx === -1) return prev;
          return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        });
        setAvailableWords((prev) => [...prev, word]);
      }
    },
    [submitted, isLocked],
  );

  const handleClear = useCallback(() => {
    if (submitted || isLocked) return;
    setAvailableWords([...content.scrambledWords]);
    setSelectedWords([]);
  }, [submitted, isLocked, content.scrambledWords]);

  const handleSubmit = useCallback(() => {
    if (selectedWords.length === 0 || submitted || isLocked) return;

    const userPhrase = selectedWords.join(" ");
    const correct =
      userPhrase.trim().toLowerCase() === content.correctSentence.trim().toLowerCase();

    setSubmitted(true);
    setIsCorrect(correct);
    onAnswer(correct, selectedWords);
  }, [selectedWords, submitted, isLocked, content.correctSentence, onAnswer]);

  const handleNext = useCallback(() => {
    setSelectedWords([]);
    setAvailableWords([...content.scrambledWords]);
    setSubmitted(false);
    setIsCorrect(false);
    onNext();
  }, [content.scrambledWords, onNext]);

  return (
    <View className="flex-1 px-4 pt-4">
      <View className="items-center mb-4">
        <Text className="text-sm text-muted-foreground mb-2">
          {t("learningFeed.phraseBuilder")}
        </Text>
        {content.hint && (
          <Text className="text-base text-muted-foreground text-center">{content.hint}</Text>
        )}
      </View>

      <View
        className="bg-card rounded-xl p-4 mb-4"
        style={{
          minHeight: 80,
          borderWidth: submitted ? 2 : 0,
          borderColor: submitted ? (isCorrect ? "#10B981" : "#EF4444") : "transparent",
        }}
      >
        {selectedWords.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {selectedWords.map((word, index) => (
              <Pressable
                key={`${word}-${index}`}
                onPress={() => handleWordTap(word, false)}
                disabled={submitted}
                className="rounded-lg px-3 py-2 active:opacity-80"
                style={{
                  backgroundColor: isDark ? "#27272A" : "#E7E5E4",
                }}
              >
                <Text className="text-base font-medium text-foreground">{word}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text className="text-sm text-muted-foreground text-center">
            {t("learningFeed.tapWordsBuildPhrase")}
          </Text>
        )}
      </View>

      {!submitted && selectedWords.length > 0 && (
        <Pressable
          className="flex-row items-center justify-center gap-2 mb-4 active:opacity-50"
          onPress={handleClear}
        >
          <RotateCcw size={14} color={isDark ? "#A1A1AA" : "#6B7280"} />
          <Text className="text-sm text-muted-foreground">{t("learningFeed.clear")}</Text>
        </Pressable>
      )}

      {!submitted && (
        <ScrollView horizontal={false} contentContainerStyle={{ flexGrow: 0 }} className="mb-4">
          <View className="flex-row flex-wrap gap-2 justify-center">
            {availableWords.map((word, index) => (
              <Pressable
                key={`${word}-${index}`}
                onPress={() => handleWordTap(word, true)}
                className="rounded-lg px-4 py-3 active:opacity-80"
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? "#3F3F46" : "#D6D3D1",
                  backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                }}
              >
                <Text className="text-base font-medium text-foreground">{word}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {submitted && !isCorrect && (
        <View className="mb-4 p-3 bg-card rounded-xl">
          <Text className="text-sm text-muted-foreground">{t("learningFeed.correctPhrase")}</Text>
          <Text className="text-base font-semibold text-foreground mt-1">
            {content.correctSentence}
          </Text>
        </View>
      )}

      {!submitted ? (
        <Pressable
          className="bg-primary rounded-xl py-4 items-center active:opacity-80"
          onPress={handleSubmit}
          disabled={selectedWords.length === 0}
          style={{ opacity: selectedWords.length > 0 ? 1 : 0.5 }}
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
