import React, { useState } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useColorScheme } from '@/hooks/useColorScheme';

import { colors } from '../../../shared/config/colors';
import { TrainingQuestion } from '../../../shared/types';

import TrainingQuestionCard from './TrainingQuestionCard';

export default function TrainingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = colors;

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
      <ThemedView
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? themeColors.background.page.dark
              : themeColors.background.page.light,
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.completionContainer}>
          <View
            style={[
              styles.completionCard,
              {
                backgroundColor: isDark
                  ? themeColors.background.card.dark
                  : themeColors.background.card.light,
              },
            ]}
          >
            <ThemedText type="title" style={styles.completionTitle}>
              Training Complete! 🎉
            </ThemedText>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{score}</ThemedText>
                <ThemedText style={styles.statLabel}>
                  Correct Answers
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>
                  {trainingSession.length}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  Total Questions
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{accuracy}%</ThemedText>
                <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: themeColors.button.primary.background },
                ]}
                onPress={handleRestart}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    { color: themeColors.button.primary.text },
                  ]}
                >
                  Try Again
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: isDark
                      ? themeColors.border.dark
                      : themeColors.border.light,
                  },
                ]}
                onPress={handleExit}
              >
                <ThemedText style={styles.secondaryButtonText}>Exit</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? themeColors.background.page.dark
            : themeColors.background.page.light,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark
              ? themeColors.background.card.dark
              : themeColors.background.card.light,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Training Session
          </ThemedText>
          <TouchableOpacity onPress={handleExit}>
            <ThemedText style={styles.exitButton}>✕</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {trainingSession.length}
          </ThemedText>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestionIndex + 1) / trainingSession.length) * 100}%`,
                  backgroundColor: themeColors.primary.light,
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.scoreContainer}>
          <ThemedText style={styles.scoreText}>
            Score: {score}/{currentQuestionIndex + 1}
          </ThemedText>
        </View>
      </View>

      {/* Training Question */}
      <TrainingQuestionCard
        question={trainingSession[currentQuestionIndex]}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  exitButton: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  completionContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  completionCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
