import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { View, Text, TextInput, Pressable } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import type { ErrorCorrectionContent } from '@/entities/exercise/api/exerciseApi';

interface ErrorCorrectionCardProps {
  content: ErrorCorrectionContent;
  onAnswer: (correct: boolean, userCorrection: string) => void;
  onNext: () => void;
  isLocked: boolean;
}

export default function ErrorCorrectionCard({
  content,
  onAnswer,
  onNext,
  isLocked,
}: ErrorCorrectionCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [userCorrection, setUserCorrection] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleWordTap = useCallback(
    (index: number) => {
      if (submitted || isLocked) return;
      setSelectedWordIdx(index);
    },
    [submitted, isLocked]
  );

  const handleSubmit = useCallback(() => {
    if (
      selectedWordIdx === null ||
      !userCorrection.trim() ||
      submitted ||
      isLocked
    )
      return;

    const foundError = selectedWordIdx === content.errorIdx;
    const correctionMatches =
      userCorrection.trim().toLowerCase() ===
      content.correction.trim().toLowerCase();
    const correct = foundError && correctionMatches;

    setSubmitted(true);
    setIsCorrect(correct);
    onAnswer(correct, userCorrection.trim());
  }, [
    selectedWordIdx,
    userCorrection,
    submitted,
    isLocked,
    content.errorIdx,
    content.correction,
    onAnswer,
  ]);

  const handleNext = useCallback(() => {
    setSelectedWordIdx(null);
    setUserCorrection('');
    setSubmitted(false);
    setIsCorrect(false);
    onNext();
  }, [onNext]);

  return (
    <View className="flex-1 px-4 pt-4">
      <View className="items-center mb-4">
        <Text className="text-sm text-muted-foreground mb-2">
          {t('learningFeed.findAndFixError')}
        </Text>
        {content.ruleTitle && (
          <Text className="text-xs text-muted-foreground">
            {content.ruleTitle}
          </Text>
        )}
      </View>

      <View className="flex-row flex-wrap gap-2 mb-6 justify-center">
        {content.words.map((word, index) => {
          const isError = submitted && index === content.errorIdx;
          const isSelected = index === selectedWordIdx;

          return (
            <Pressable
              key={index}
              onPress={() => handleWordTap(index)}
              disabled={submitted}
              className="rounded-lg px-3 py-2 active:opacity-80"
              style={{
                borderWidth: 2,
                borderColor: isError
                  ? '#EF4444'
                  : isSelected
                    ? '#3B82F6'
                    : 'transparent',
                backgroundColor: isError
                  ? 'rgba(239, 68, 68, 0.1)'
                  : isSelected
                    ? 'rgba(59, 130, 246, 0.1)'
                    : isDark
                      ? '#1C1C1E'
                      : '#F5F5F4',
              }}
            >
              <Text
                className="text-base font-medium"
                style={{
                  color: isError
                    ? '#EF4444'
                    : isSelected
                      ? '#3B82F6'
                      : isDark
                        ? '#FAFAF9'
                        : '#111827',
                }}
              >
                {word}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedWordIdx !== null && !submitted && (
        <View className="mb-4">
          <TextInput
            className="bg-card border-2 rounded-xl px-4 py-4 text-center text-base font-medium text-foreground"
            style={{
              borderColor: isDark ? '#27272A' : '#E7E5E4',
            }}
            placeholder={t('learningFeed.typeCorrectedSentence')}
            placeholderTextColor={isDark ? '#52525B' : '#A1A1AA'}
            value={userCorrection}
            onChangeText={setUserCorrection}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleSubmit}
          />
        </View>
      )}

      {submitted && !isCorrect && (
        <View className="mb-4 p-3 bg-card rounded-xl">
          <Text className="text-sm text-muted-foreground">
            {t('learningFeed.correctAnswer')}
          </Text>
          <Text className="text-base font-semibold text-foreground mt-1">
            {content.correction}
          </Text>
          {content.explanation && (
            <Text className="text-sm text-muted-foreground mt-2">
              {content.explanation}
            </Text>
          )}
        </View>
      )}

      {submitted && isCorrect && content.explanation && (
        <View className="mb-4 p-3 bg-card rounded-xl">
          <Text className="text-sm text-muted-foreground">
            {content.explanation}
          </Text>
        </View>
      )}

      {!submitted ? (
        <Pressable
          className="bg-primary rounded-xl py-4 items-center active:opacity-80"
          onPress={handleSubmit}
          disabled={selectedWordIdx === null || !userCorrection.trim()}
          style={{
            opacity:
              selectedWordIdx !== null && userCorrection.trim() ? 1 : 0.5,
          }}
        >
          <Text className="text-white font-semibold text-base">
            {t('learningFeed.check')}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          className="bg-primary rounded-xl py-4 items-center active:opacity-80"
          onPress={handleNext}
        >
          <Text className="text-white font-semibold text-base">
            {t('learningFeed.next')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
