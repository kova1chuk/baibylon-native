import React, { useState, useEffect } from 'react';

import { View, Text, Pressable, Alert } from 'react-native';

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
      return {
        borderColor: selectedAnswer === answer ? '#10B981' : '#D1D5DB',
        backgroundColor:
          selectedAnswer === answer ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
      };
    }

    if (answer === question.correctAnswer) {
      return {
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      };
    }

    if (selectedAnswer === answer && answer !== question.correctAnswer) {
      return {
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      };
    }

    return {
      borderColor: '#D1D5DB',
      backgroundColor: 'transparent',
    };
  };

  const timerColor =
    timeLeft > 10 ? '#10B981' : timeLeft > 5 ? '#F59E0B' : '#EF4444';

  return (
    <View className="p-6 rounded-2xl m-4 bg-card shadow-sm">
      {/* Timer */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-sm text-muted-foreground">Time remaining:</Text>
        <View
          className="px-3 py-1.5 rounded-2xl min-w-[50px] items-center justify-center"
          style={{ backgroundColor: timerColor }}
        >
          <Text className="text-white text-sm font-semibold">{timeLeft}s</Text>
        </View>
      </View>

      {/* Question */}
      <View className="mb-6">
        <Text className="text-xl mb-4 leading-6 text-foreground">
          {getQuestionText()}
        </Text>

        {question.word.context && (
          <View
            className="p-4 rounded-lg bg-muted"
            style={{ borderLeftWidth: 4, borderLeftColor: '#10B981' }}
          >
            <Text className="text-sm leading-5 italic text-foreground">
              {question.word.context}
            </Text>
          </View>
        )}
      </View>

      {/* Options */}
      <View className="gap-3 mb-6">
        {question.options ? (
          question.options.map((option, index) => {
            const style = getAnswerStyle(option);
            return (
              <Pressable
                key={index}
                className="rounded-xl py-3 px-4 active:opacity-70"
                style={{
                  borderWidth: 2,
                  borderColor: style.borderColor,
                  backgroundColor: style.backgroundColor,
                }}
                onPress={() => handleAnswerSelect(option)}
                disabled={isAnswered}
              >
                <Text className="text-base text-center text-foreground">
                  {option}
                </Text>
              </Pressable>
            );
          })
        ) : (
          <View className="p-4 rounded-lg border-2 border-dashed border-border items-center">
            <Text className="text-sm text-muted-foreground">
              Type your answer in the input field below
            </Text>
          </View>
        )}
      </View>

      {/* Next button */}
      {isAnswered && (
        <Pressable
          className="bg-primary rounded-xl py-4 items-center mb-5 active:opacity-80"
          onPress={handleNext}
        >
          <Text className="text-white font-semibold text-lg">
            Next Question
          </Text>
        </Pressable>
      )}

      {/* Word info */}
      <View className="pt-4 border-t border-border">
        <Text className="text-xs text-muted-foreground mb-1">
          Word: {question.word.text}
        </Text>
        <Text className="text-xs text-muted-foreground mb-1">
          Difficulty: {question.word.difficulty}
        </Text>
        <Text className="text-xs text-muted-foreground">
          Status: {question.word.status}
        </Text>
      </View>
    </View>
  );
}
