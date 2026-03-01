import React, { useState } from 'react';

import { View, ScrollView, Text, Pressable, Alert } from 'react-native';

import TrainingQuestionCard from './TrainingQuestionCard';

interface DemoWord {
  id: string;
  text: string;
  translation: string;
  difficulty: string;
  status: string;
  context: string;
  examples: string[];
  createdAt: string;
  updatedAt: string;
  lastReviewed?: string;
  reviewCount: number;
  correctAnswers: number;
  totalAnswers: number;
}

interface DemoTrainingQuestion {
  id: string;
  type: 'translation' | 'context' | 'multipleChoice';
  word: DemoWord;
  question?: string;
  options: string[];
  correctAnswer: string;
}

export default function TrainingScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [trainingSession] = useState<DemoTrainingQuestion[]>([
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
            Alert.alert('Info', 'Navigation back to main screen coming soon!');
          },
        },
      ]
    );
  };

  if (isTrainingComplete) {
    const accuracy = Math.round((score / trainingSession.length) * 100);
    return (
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View className="p-8 rounded-2xl items-center bg-card shadow-sm">
            <Text className="text-3xl font-bold text-center mb-8 text-foreground">
              Training Complete! 🎉
            </Text>

            <View className="flex-row justify-around w-full mb-8">
              {[
                { value: score, label: 'Correct Answers' },
                { value: trainingSession.length, label: 'Total Questions' },
                { value: `${accuracy}%`, label: 'Accuracy' },
              ].map(item => (
                <View key={item.label} className="items-center">
                  <Text className="text-4xl font-bold text-foreground mb-2">
                    {item.value}
                  </Text>
                  <Text className="text-sm text-muted-foreground text-center">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            <View className="gap-4 w-full">
              <Pressable
                className="bg-primary rounded-xl py-4 items-center active:opacity-80"
                onPress={handleRestart}
              >
                <Text className="text-white font-semibold text-lg">
                  Try Again
                </Text>
              </Pressable>

              <Pressable
                className="border-2 border-border rounded-xl py-4 items-center active:opacity-80"
                onPress={handleExit}
              >
                <Text className="text-foreground font-semibold text-lg">
                  Exit
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Training header */}
      <View className="p-5 m-4 rounded-2xl bg-card shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-semibold text-foreground">
            Training Session
          </Text>
          <Pressable className="p-2 active:opacity-50" onPress={handleExit}>
            <Text className="text-xl font-bold text-muted-foreground">✕</Text>
          </Pressable>
        </View>
        <View className="mb-3">
          <Text className="text-sm mb-2 text-muted-foreground">
            Question {currentQuestionIndex + 1} of {trainingSession.length}
          </Text>
          <View className="h-1 bg-muted rounded-full overflow-hidden">
            <View
              className="h-full rounded-full bg-primary"
              style={{
                width: `${((currentQuestionIndex + 1) / trainingSession.length) * 100}%`,
              }}
            />
          </View>
        </View>
        <View className="items-end">
          <Text className="text-base font-semibold text-foreground">
            Score: {score}/{currentQuestionIndex + 1}
          </Text>
        </View>
      </View>

      {/* Question card */}
      <TrainingQuestionCard
        question={trainingSession[currentQuestionIndex]}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </View>
  );
}
