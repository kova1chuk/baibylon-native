import { useState, useCallback, useEffect, useRef } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/shared/config/api';

import { useSocket } from './useSocket';

export interface ChatMessageWidget {
  type: string;
  data: Record<string, unknown>;
}

export interface CorrectionItem {
  original: string;
  corrected: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  widget?: ChatMessageWidget;
  corrections?: CorrectionItem[];
}

interface MessageResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  widget?: ChatMessageWidget;
}

interface MessagesApiResponse {
  messages: MessageResponse[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface TutorResponse {
  message: string;
  suggestions: string[];
  correction: string;
  mistakes: { index: number; word: string; mistake: string }[];
  quality: number;
}

interface UseChatOptions {
  onResponse?: (response: TutorResponse) => void;
  onError?: (error: string) => void;
  enableSuggestions?: boolean;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm your AI language tutor. How can I help you learn English today?",
  timestamp: new Date(),
};

export function useChat(options: UseChatOptions = {}) {
  const {
    onResponse,
    onError,
    enableSuggestions: enableSuggestionsOption = true,
  } = options;
  const { session } = useAuth();
  const { isConnected, emit, on } = useSocket();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pendingMessageRef = useRef<string | null>(null);

  const fetchMessages = useCallback(
    async (cursor?: string) => {
      try {
        const token = session?.access_token;
        if (!token) return null;

        let url = `${API_BASE_URL}/tutor/messages?limit=20`;
        if (cursor) url += `&cursor=${cursor}`;

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return null;

        const data: MessagesApiResponse = await response.json();
        return data;
      } catch {
        return null;
      }
    },
    [session?.access_token]
  );

  useEffect(() => {
    let aborted = false;

    const loadInitialMessages = async () => {
      setIsLoadingHistory(true);

      const data = await fetchMessages();
      if (aborted) return;

      if (data && data.messages.length > 0) {
        const loadedMessages = data.messages
          .map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            ...(msg.widget ? { widget: msg.widget } : {}),
          }))
          .reverse();

        setMessages(loadedMessages);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } else {
        setMessages([WELCOME_MESSAGE]);
        setHasMore(false);
      }

      if (!aborted) setIsLoadingHistory(false);
    };

    loadInitialMessages();
    return () => {
      aborted = true;
    };
  }, [fetchMessages]);

  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMore || !nextCursor) return;

    setIsLoadingMore(true);
    const data = await fetchMessages(nextCursor);

    if (data && data.messages.length > 0) {
      const olderMessages = data.messages
        .map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          ...(msg.widget ? { widget: msg.widget } : {}),
        }))
        .reverse();

      setMessages(prev => [...olderMessages, ...prev]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } else {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, nextCursor, fetchMessages]);

  useEffect(() => {
    const handleResponse = (data: TutorResponse) => {
      const newMessages: ChatMessage[] = [];

      if (data.mistakes && data.mistakes.length > 0) {
        newMessages.push({
          id: `correction-${Date.now()}`,
          role: 'assistant',
          content: data.correction || '',
          timestamp: new Date(),
          corrections: data.mistakes.map(m => ({
            original: m.word,
            corrected: m.mistake,
          })),
        });
      }

      newMessages.push({
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      });

      setMessages(prev => [...prev, ...newMessages]);
      setIsLoading(false);
      pendingMessageRef.current = null;

      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }

      onResponse?.(data);
    };

    const handleError = (data: { message: string; error?: string }) => {
      const errorMsg = data.error || data.message;
      setError(errorMsg);
      setIsLoading(false);

      if (pendingMessageRef.current) {
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMsg}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        pendingMessageRef.current = null;
      }

      onError?.(errorMsg);
    };

    const handleRateLimit = (data: { message: string }) => {
      setIsLoading(false);
      pendingMessageRef.current = null;
      const rateLimitMessage: ChatMessage = {
        id: `rate-limit-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, rateLimitMessage]);
    };

    const unsubResponse = on<TutorResponse>('response', handleResponse);
    const unsubError = on<{ message: string; error?: string }>(
      'error',
      handleError
    );
    const unsubRateLimit = on<{ message: string }>(
      'rate_limit',
      handleRateLimit
    );

    return () => {
      unsubResponse();
      unsubError();
      unsubRateLimit();
    };
  }, [on, onResponse, onError]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      if (!isConnected) {
        const errorMessage: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            'Unable to send message — connection lost. Please try again.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      setIsLoading(true);
      setSuggestions([]);
      setError(null);
      pendingMessageRef.current = content;

      emit('message', {
        message: content.trim(),
        enableSuggestions: enableSuggestionsOption,
      });
    },
    [emit, isLoading, isConnected, enableSuggestionsOption]
  );

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateMessage = useCallback(
    (id: string, updates: Partial<ChatMessage>) => {
      setMessages(prev =>
        prev.map(msg => (msg.id === id ? { ...msg, ...updates } : msg))
      );
    },
    []
  );

  return {
    messages,
    isLoading,
    isLoadingHistory,
    isLoadingMore,
    hasMore,
    suggestions,
    error,
    isConnected,
    sendMessage,
    loadMoreMessages,
    addMessage,
    updateMessage,
  };
}
