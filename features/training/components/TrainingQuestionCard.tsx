import React, { useState, useEffect } from 'react';

import { Text, YStack, XStack, Button } from 'tamagui';

import { Alert } from 'react-native';


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

  const getAnswerButtonProps = (answer: string) => {
    if (!isAnswered) {
      return {
        borderColor: selectedAnswer === answer ? '$blue10' : '$borderColor',
        backgroundColor:
          selectedAnswer === answer ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      };
    }

    if (answer === question.correctAnswer) {
      return {
        borderColor: '$green10',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      };
    }

    if (selectedAnswer === answer && answer !== question.correctAnswer) {
      return {
        borderColor: '$red10',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      };
    }

    return {
      borderColor: '$borderColor',
      backgroundColor: 'transparent',
    };
  };

  const timerColor =
    timeLeft > 10 ? '$green10' : timeLeft > 5 ? '$yellow10' : '$red10';

  return (
    <YStack
      padding="$6"
      borderRadius="$4"
      margin="$4"
      backgroundColor="$background"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      elevation={8}
    >
      {/* Timer */}
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$5">
        <Text fontSize="$3" opacity={0.7} color="$color">
          Time remaining:
        </Text>
        <XStack
          paddingHorizontal="$3"
          paddingVertical="$1.5"
          borderRadius="$4"
          backgroundColor={timerColor}
          minWidth={50}
          alignItems="center"
          justifyContent="center"
        >
          <Text color="white" fontSize="$3" fontWeight="600">
            {timeLeft}s
          </Text>
        </XStack>
      </XStack>

      {/* Question */}
      <YStack marginBottom="$6">
        <Text fontSize="$6" marginBottom="$4" lineHeight={24} color="$color">
          {getQuestionText()}
        </Text>

        {question.word.context && (
          <YStack
            padding="$4"
            borderRadius="$2"
            borderLeftWidth={4}
            borderLeftColor="$blue10"
            backgroundColor="$backgroundHover"
          >
            <Text fontSize="$3" lineHeight={20} fontStyle="italic" color="$color">
              {question.word.context}
            </Text>
          </YStack>
        )}
      </YStack>

      {/* Answer Options */}
      <YStack gap="$3" marginBottom="$6">
        {question.options ? (
          question.options.map((option, index) => {
            const buttonProps = getAnswerButtonProps(option);
            return (
              <Button
                key={index}
                size="$4"
                borderWidth={2}
                borderColor={buttonProps.borderColor}
                backgroundColor={buttonProps.backgroundColor}
                onPress={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                color="$color"
              >
                <Text fontSize="$4" textAlign="center" color="$color">
                  {option}
                </Text>
              </Button>
            );
          })
        ) : (
          <YStack
            padding="$4"
            borderRadius="$2"
            borderWidth={2}
            borderColor="$borderColor"
            borderStyle="dashed"
            alignItems="center"
          >
            <Text fontSize="$3" opacity={0.7} color="$color">
              Type your answer in the input field below
            </Text>
          </YStack>
        )}
      </YStack>

      {/* Next Button */}
      {isAnswered && (
        <Button
          size="$5"
          backgroundColor="$blue10"
          color="white"
          fontWeight="600"
          onPress={handleNext}
          marginBottom="$5"
        >
          Next Question
        </Button>
      )}

      {/* Progress Info */}
      <YStack paddingTop="$4" borderTopWidth={1} borderTopColor="$borderColor">
        <Text fontSize="$2" opacity={0.6} marginBottom="$1" color="$color">
          Word: {question.word.text}
        </Text>
        <Text fontSize="$2" opacity={0.6} marginBottom="$1" color="$color">
          Difficulty: {question.word.difficulty}
        </Text>
        <Text fontSize="$2" opacity={0.6} color="$color">
          Status: {question.word.status}
        </Text>
      </YStack>
    </YStack>
  );
}

