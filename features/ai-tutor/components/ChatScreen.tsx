import React, { useCallback, useRef, useState } from 'react';

import { Send } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../hooks/useChat';
import { useQuiz } from '../hooks/useQuiz';
import type { QuizQuestion, QuizResult } from '../types/quiz';

import VocabQuizWidget from './VocabQuizWidget';

interface ChatScreenProps {
  enableSuggestions?: boolean;
  onQuizResult?: (correct: boolean, word: string) => void;
}

export default function ChatScreen({
  enableSuggestions = true,
  onQuizResult,
}: ChatScreenProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [inputValue, setInputValue] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    isLoading,
    isLoadingHistory,
    suggestions,
    isConnected,
    sendMessage,
  } = useChat({ enableSuggestions });

  const {
    currentQuiz,
    quizResult,
    isLoading: quizLoading,
    submitAnswer,
  } = useQuiz({
    onResult: (result, _message) => {
      onQuizResult?.(result.isCorrect, result.correctAnswer);
    },
  });

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  }, [inputValue, sendMessage]);

  const handleSuggestionPress = useCallback(
    (suggestion: string) => {
      sendMessage(suggestion);
    },
    [sendMessage]
  );

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === 'user';

      return (
        <View className={`mb-3 px-4 ${isUser ? 'items-end' : 'items-start'}`}>
          <View
            className={`rounded-2xl px-4 py-3 max-w-[85%] ${
              isUser ? 'bg-primary' : 'bg-card'
            }`}
          >
            <Text
              className={`text-base ${
                isUser ? 'text-white' : 'text-foreground'
              }`}
            >
              {item.content}
            </Text>
          </View>

          {item.corrections && item.corrections.length > 0 && (
            <View className="bg-card rounded-xl p-3 mt-1 max-w-[85%]">
              {item.corrections.map((c, i) => (
                <View key={i} className="flex-row items-center gap-2 mb-1">
                  <Text className="text-sm text-muted-foreground line-through">
                    {c.original}
                  </Text>
                  <Text className="text-sm font-medium text-foreground">
                    → {c.corrected}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {item.widget && item.widget.type === 'vocab-quiz' && (
            <View className="max-w-[85%] w-full">
              <VocabQuizWidget
                quiz={item.widget.data.quiz as QuizQuestion}
                result={item.widget.data.quizResult as QuizResult | null}
                onAnswer={submitAnswer}
                isLoading={quizLoading}
              />
            </View>
          )}
        </View>
      );
    },
    [submitAnswer, quizLoading]
  );

  if (isLoadingHistory) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  const allMessages = [...messages];
  if (currentQuiz && !messages.some(m => m.widget?.type === 'vocab-quiz')) {
    allMessages.push({
      id: `quiz-${currentQuiz.id}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      widget: {
        type: 'vocab-quiz',
        data: { quiz: currentQuiz, quizResult },
      },
    });
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={allMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 12 }}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      {isLoading && (
        <View className="px-4 pb-2 items-start">
          <View className="bg-card rounded-2xl px-4 py-3">
            <ActivityIndicator size="small" />
          </View>
        </View>
      )}

      {suggestions.length > 0 && (
        <View className="px-4 pb-2">
          <View className="flex-row flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={index}
                onPress={() => handleSuggestionPress(suggestion)}
                className="rounded-full px-3 py-1.5 active:opacity-80"
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? '#3F3F46' : '#D6D3D1',
                }}
              >
                <Text className="text-sm text-foreground">{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View
        className="flex-row items-end gap-2 px-4 py-3 border-t"
        style={{
          borderTopColor: isDark ? '#27272A' : '#E7E5E4',
        }}
      >
        {!isConnected && (
          <View className="absolute top-0 left-0 right-0 bg-destructive/10 py-1 px-4">
            <Text className="text-xs text-destructive text-center">
              {t('learningFeed.startError')}
            </Text>
          </View>
        )}

        <TextInput
          className="flex-1 bg-card rounded-xl px-4 py-3 text-base text-foreground"
          style={{ maxHeight: 100 }}
          placeholder={t('aiTutor.chatPlaceholder')}
          placeholderTextColor={isDark ? '#52525B' : '#A1A1AA'}
          value={inputValue}
          onChangeText={setInputValue}
          multiline
          editable={!isLoading}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />

        <Pressable
          onPress={handleSend}
          disabled={!inputValue.trim() || isLoading}
          className="rounded-xl p-3 items-center justify-center active:opacity-80"
          style={{
            backgroundColor:
              inputValue.trim() && !isLoading
                ? isDark
                  ? '#6EE7B7'
                  : '#10B981'
                : isDark
                  ? '#27272A'
                  : '#E7E5E4',
          }}
        >
          <Send
            size={20}
            color={
              inputValue.trim() && !isLoading
                ? isDark
                  ? '#0A0A0F'
                  : '#FFFFFF'
                : isDark
                  ? '#52525B'
                  : '#A1A1AA'
            }
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
