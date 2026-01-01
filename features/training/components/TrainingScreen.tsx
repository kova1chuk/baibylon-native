import React, { useState } from 'react';

import { View, ScrollView, Text, YStack, XStack, Button } from 'tamagui';

import { Alert } from 'react-native';

import { TrainingQuestion } from '../../../shared/types';

import TrainingQuestionCard from './TrainingQuestionCard';

export default function TrainingScreen() {
  // Mock training data - in real app this would come from API/context
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [trainingSession] = useState<TrainingQuestion[]>([
    {
      id: '1',
      word: {
        id: '1',
        text: 'serendipity',
        translation: 'a pleasant surprise',
        difficulty: 'advanced',
        status: 'notLearned',
        context: 'Finding that book was pure serendipity.',
        examples: ['The meeting was a serendipitous encounter.'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastReviewed: undefined,
        reviewCount: 0,
        correctAnswers: 0,
        totalAnswers: 0,
      },
      type: 'translation',
      options: [
        'a pleasant surprise',
        'a difficult challenge',
        'a planned event',
        'a random occurrence',
      ],
      correctAnswer: 'a pleasant surprise',
    },
    {
      id: '2',
      word: {
        id: '2',
        text: 'ephemeral',
        translation: 'lasting for a very short time',
        difficulty: 'intermediate',
        status: 'beginner',
        context: 'The beauty of cherry blossoms is ephemeral.',
        examples: ['Fame can be ephemeral in the entertainment industry.'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastReviewed: '2024-01-01T00:00:00Z',
        reviewCount: 1,
        correctAnswers: 1,
        totalAnswers: 1,
      },
      type: 'context',
      options: [
        'lasting for a very short time',
        'extremely beautiful',
        'difficult to understand',
        'very expensive',
      ],
      correctAnswer: 'lasting for a very short time',
    },
    {
      id: '3',
      word: {
        id: '3',
        text: 'ubiquitous',
        translation: 'present everywhere',
        difficulty: 'intermediate',
        status: 'basic',
        context: 'Smartphones have become ubiquitous in modern society.',
        examples: ['Coffee shops are ubiquitous in this neighborhood.'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastReviewed: '2024-01-01T00:00:00Z',
        reviewCount: 2,
        correctAnswers: 2,
        totalAnswers: 2,
      },
      type: 'multipleChoice',
      options: [
        'present everywhere',
        'very expensive',
        'difficult to find',
        'temporarily available',
      ],
      correctAnswer: 'present everywhere',
    },
  ]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < trainingSession.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsTrainingComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsTrainingComplete(false);
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Training',
      'Are you sure you want to exit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            // TODO: Navigate back to main screen
            Alert.alert('Info', 'Navigation back to main screen coming soon!');
          },
        },
      ]
    );
  };

  if (isTrainingComplete) {
    const accuracy = Math.round((score / trainingSession.length) * 100);
    return (
      <View flex={1} backgroundColor="$background">
        <ScrollView
          flex={1}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <YStack
            padding="$8"
            borderRadius="$4"
            alignItems="center"
            backgroundColor="$background"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.1}
            shadowRadius={8}
            elevation={8}
          >
            <Text
              fontSize="$9"
              fontWeight="bold"
              textAlign="center"
              marginBottom="$8"
            >
              Training Complete! 🎉
            </Text>

            <XStack
              justifyContent="space-around"
              width="100%"
              marginBottom="$8"
            >
              <YStack alignItems="center">
                <Text
                  fontSize="$10"
                  fontWeight="bold"
                  color="$color"
                  marginBottom="$2"
                >
                  {score}
                </Text>
                <Text
                  fontSize="$3"
                  opacity={0.7}
                  textAlign="center"
                  color="$color"
                >
                  Correct Answers
                </Text>
              </YStack>
              <YStack alignItems="center">
                <Text
                  fontSize="$10"
                  fontWeight="bold"
                  color="$color"
                  marginBottom="$2"
                >
                  {trainingSession.length}
                </Text>
                <Text
                  fontSize="$3"
                  opacity={0.7}
                  textAlign="center"
                  color="$color"
                >
                  Total Questions
                </Text>
              </YStack>
              <YStack alignItems="center">
                <Text
                  fontSize="$10"
                  fontWeight="bold"
                  color="$color"
                  marginBottom="$2"
                >
                  {accuracy}%
                </Text>
                <Text
                  fontSize="$3"
                  opacity={0.7}
                  textAlign="center"
                  color="$color"
                >
                  Accuracy
                </Text>
              </YStack>
            </XStack>

            <YStack gap="$4" width="100%">
              <Button
                size="$5"
                backgroundColor="$blue10"
                color="white"
                fontWeight="600"
                onPress={handleRestart}
              >
                Try Again
              </Button>

              <Button
                size="$5"
                borderColor="$borderColor"
                borderWidth={2}
                backgroundColor="transparent"
                color="$color"
                fontWeight="600"
                onPress={handleExit}
              >
                Exit
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <YStack
        padding="$5"
        margin="$4"
        borderRadius="$4"
        backgroundColor="$background"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={4}
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Text fontSize="$6" fontWeight="600" color="$color">
            Training Session
          </Text>
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            onPress={handleExit}
          >
            <Text fontSize="$6" fontWeight="bold" opacity={0.7} color="$color">
              ✕
            </Text>
          </Button>
        </XStack>
        <YStack marginBottom="$3">
          <Text fontSize="$3" marginBottom="$2" opacity={0.8} color="$color">
            Question {currentQuestionIndex + 1} of {trainingSession.length}
          </Text>
          <View
            height={4}
            backgroundColor="$gray5"
            borderRadius={2}
            overflow="hidden"
          >
            <View
              height="100%"
              borderRadius={2}
              backgroundColor="$blue10"
              width={`${((currentQuestionIndex + 1) / trainingSession.length) * 100}%`}
            />
          </View>
        </YStack>
        <XStack alignItems="flex-end">
          <Text fontSize="$4" fontWeight="600" color="$color">
            Score: {score}/{currentQuestionIndex + 1}
          </Text>
        </XStack>
      </YStack>

      {/* Training Question */}
      <TrainingQuestionCard
        question={trainingSession[currentQuestionIndex]}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </View>
  );
}
