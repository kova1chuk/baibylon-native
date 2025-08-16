import React, { useState, useEffect } from 'react';

import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useColorScheme } from '@/hooks/useColorScheme';

import { colors } from '../../../shared/config/colors';
import { TrainingQuestion } from '../../../shared/types';

interface TrainingQuestionCardProps {
  question: TrainingQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export default function TrainingQuestionCard({
  question,
  onAnswer,
  onNext,
}: TrainingQuestionCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = colors;

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeout();
    }
  }, [timeLeft, isAnswered]);

  const handleTimeout = () => {
    setIsAnswered(true);
    onAnswer(false);
    Alert.alert(
      "Time's up!",
      'The correct answer was: ' + question.correctAnswer
    );
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === question.correctAnswer;
    onAnswer(isCorrect);

    if (isCorrect) {
      Alert.alert('Correct!', 'Great job! 🎉');
    } else {
      Alert.alert(
        'Incorrect',
        `The correct answer was: ${question.correctAnswer}`
      );
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(30);
    onNext();
  };

  const getQuestionText = () => {
    switch (question.type) {
      case 'translation':
        return `What is the translation of "${question.word.text}"?`;
      case 'context':
        return `What does "${question.word.text}" mean in this context?`;
      case 'multipleChoice':
        return `Select the correct meaning of "${question.word.text}":`;
      default:
        return `What is the meaning of "${question.word.text}"?`;
    }
  };

  const getAnswerStyle = (answer: string) => {
    if (!isAnswered) {
      return selectedAnswer === answer ? styles.selectedAnswer : styles.answer;
    }

    if (answer === question.correctAnswer) {
      return [styles.answer, styles.correctAnswer];
    }

    if (selectedAnswer === answer && answer !== question.correctAnswer) {
      return [styles.answer, styles.incorrectAnswer];
    }

    return styles.answer;
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? themeColors.background.card.dark
            : themeColors.background.card.light,
        },
      ]}
    >
      {/* Timer */}
      <View style={styles.timerContainer}>
        <ThemedText style={styles.timerLabel}>Time remaining:</ThemedText>
        <View
          style={[
            styles.timer,
            {
              backgroundColor:
                timeLeft > 10
                  ? themeColors.success
                  : timeLeft > 5
                    ? themeColors.warning
                    : themeColors.error,
            },
          ]}
        >
          <ThemedText style={styles.timerText}>{timeLeft}s</ThemedText>
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <ThemedText type="subtitle" style={styles.questionText}>
          {getQuestionText()}
        </ThemedText>

        {question.context && (
          <View
            style={[
              styles.contextContainer,
              {
                backgroundColor: isDark
                  ? themeColors.background.secondary.dark
                  : themeColors.background.secondary.light,
              },
            ]}
          >
            <ThemedText style={styles.contextText}>
              {question.context}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Answer Options */}
      <View style={styles.answersContainer}>
        {question.options ? (
          question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getAnswerStyle(option)}
              onPress={() => handleAnswerSelect(option)}
              disabled={isAnswered}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.answerText}>{option}</ThemedText>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.freeAnswerContainer}>
            <ThemedText style={styles.freeAnswerText}>
              Type your answer in the input field below
            </ThemedText>
            {/* TODO: Add TextInput for free answer */}
          </View>
        )}
      </View>

      {/* Next Button */}
      {isAnswered && (
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: themeColors.button.primary.background },
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <ThemedText
            style={[
              styles.nextButtonText,
              { color: themeColors.button.primary.text },
            ]}
          >
            Next Question
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* Progress Info */}
      <View style={styles.progressInfo}>
        <ThemedText style={styles.progressText}>
          Word: {question.word.text}
        </ThemedText>
        <ThemedText style={styles.progressText}>
          Difficulty: {question.word.difficulty}
        </ThemedText>
        <ThemedText style={styles.progressText}>
          Status: {question.word.status}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  timer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 16,
    lineHeight: 24,
  },
  contextContainer: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  contextText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  answersContainer: {
    marginBottom: 24,
  },
  answer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  selectedAnswer: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  correctAnswer: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  incorrectAnswer: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  answerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  freeAnswerContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  freeAnswerText: {
    fontSize: 14,
    opacity: 0.7,
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  progressText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
});
