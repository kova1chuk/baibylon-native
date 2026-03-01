import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { View, Text, Pressable } from 'react-native';

import type { Word } from '@/entities/word/types';

interface FlashcardCardProps {
  word: Word;
  onRate: (quality: number) => void;
}

export default function FlashcardCard({ word, onRate }: FlashcardCardProps) {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleRate = useCallback(
    (quality: number) => {
      setIsFlipped(false);
      onRate(quality);
    },
    [onRate]
  );

  return (
    <View className="flex-1 px-4 pt-4">
      <Pressable
        className="flex-1 bg-card rounded-2xl shadow-sm justify-center items-center p-6"
        onPress={handleFlip}
        style={{ minHeight: 300 }}
      >
        {!isFlipped ? (
          <View className="items-center gap-3">
            <Text className="text-4xl font-bold text-foreground text-center">
              {word.word}
            </Text>
            {word.phonetic?.text && (
              <Text className="text-base text-muted-foreground">
                {word.phonetic.text}
              </Text>
            )}
            <Text className="text-sm text-muted-foreground mt-4">
              {t('learningFeed.pressSpaceToFlip')}
            </Text>
          </View>
        ) : (
          <View className="items-center gap-4 w-full">
            {word.translation && (
              <Text className="text-2xl font-semibold text-foreground text-center">
                {word.translation}
              </Text>
            )}
            {word.definition && (
              <Text className="text-base text-muted-foreground text-center leading-relaxed">
                {word.definition}
              </Text>
            )}
            {word.example && (
              <Text className="text-sm text-muted-foreground italic text-center mt-2">
                {word.example}
              </Text>
            )}
          </View>
        )}
      </Pressable>

      {isFlipped && (
        <View className="flex-row gap-3 mt-4 mb-4">
          <Pressable
            className="flex-1 rounded-xl py-3 items-center active:opacity-80"
            style={{ backgroundColor: '#EF4444' }}
            onPress={() => handleRate(1)}
          >
            <Text className="text-white font-semibold">
              {t('learningFeed.again')}
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-xl py-3 items-center active:opacity-80"
            style={{ backgroundColor: '#F59E0B' }}
            onPress={() => handleRate(3)}
          >
            <Text className="text-white font-semibold">
              {t('learningFeed.hard')}
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-xl py-3 items-center active:opacity-80"
            style={{ backgroundColor: '#3B82F6' }}
            onPress={() => handleRate(4)}
          >
            <Text className="text-white font-semibold">
              {t('learningFeed.good')}
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-xl py-3 items-center active:opacity-80"
            style={{ backgroundColor: '#10B981' }}
            onPress={() => handleRate(5)}
          >
            <Text className="text-white font-semibold">
              {t('learningFeed.easy')}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
