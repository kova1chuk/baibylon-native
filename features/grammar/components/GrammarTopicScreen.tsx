import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocalSearchParams } from 'expo-router';
import {
  BookOpen,
  Check,
  ChevronDown,
  RefreshCw,
  X,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import {
  useGetTopicContentQuery,
  useUpdateTopicProgressMutation,
  useUpdateRuleProgressMutation,
} from '@/entities/grammar/api/grammarApi';

import {
  GrammarExplanation,
  GrammarSentence,
  GrammarTipText,
} from './GrammarRichText';

import type { TopicContentData } from '@/entities/grammar/api/types';

type Rule = TopicContentData['rules'][number];
type Example = Rule['examples'][number];

function StatusBadge({ status }: { status: string }) {
  let color = '#6B7280';
  let label = 'Not Started';

  if (status === 'in_progress') {
    color = '#F59E0B';
    label = 'In Progress';
  } else if (status === 'completed') {
    color = '#10B981';
    label = 'Completed';
  } else if (status === 'mastered') {
    color = '#D97706';
    label = 'Mastered';
  }

  return (
    <View
      className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{
        backgroundColor: `${color}10`,
        borderWidth: 1,
        borderColor: `${color}20`,
      }}
    >
      <View
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-[10px] font-medium" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

function ExampleCard({ example }: { example: Example }) {
  const isCorrect = example.is_correct;
  const color = isCorrect ? '#10B981' : '#EF4444';

  return (
    <View
      className="flex-row gap-2.5 rounded-lg p-3 mb-1.5"
      style={{
        backgroundColor: isCorrect
          ? 'rgba(16,185,129,0.05)'
          : 'rgba(239,68,68,0.04)',
        borderWidth: 1,
        borderColor: isCorrect
          ? 'rgba(16,185,129,0.1)'
          : 'rgba(239,68,68,0.08)',
        borderLeftWidth: 3,
        borderLeftColor: color,
      }}
    >
      <View
        className="w-5 h-5 rounded-full items-center justify-center mt-0.5"
        style={{
          backgroundColor: isCorrect
            ? 'rgba(16,185,129,0.12)'
            : 'rgba(239,68,68,0.1)',
        }}
      >
        {isCorrect ? (
          <Check size={10} color={color} strokeWidth={2.5} />
        ) : (
          <X size={10} color={color} strokeWidth={2.5} />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium" style={{ color }}>
          <GrammarSentence text={example.sentence} />
        </Text>
        {example.explanation ? (
          <Text className="text-xs text-muted-foreground mt-0.5 italic">
            {example.explanation}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function RuleAccordion({
  rule,
  index,
  isOpen,
  onToggle,
  onMarkUnderstood,
  isUpdating,
  isDark,
}: {
  rule: Rule;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onMarkUnderstood: (ruleId: string, understood: boolean) => void;
  isUpdating: boolean;
  isDark: boolean;
}) {
  const understood = rule.progress?.understood ?? false;

  return (
    <View
      className="mb-2.5 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isDark ? '#111113' : '#FFFFFF',
        borderWidth: 1,
        borderColor: isOpen
          ? 'rgba(129,140,248,0.2)'
          : isDark
            ? '#27272A'
            : '#E7E5E4',
      }}
    >
      <Pressable
        className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-80"
        onPress={onToggle}
      >
        {understood ? (
          <View
            className="w-5 h-5 rounded-full items-center justify-center"
            style={{
              borderWidth: 1.5,
              borderColor: 'rgba(16,185,129,0.3)',
              backgroundColor: 'rgba(16,185,129,0.08)',
            }}
          >
            <Check size={12} color="#10B981" strokeWidth={2.5} />
          </View>
        ) : (
          <View
            className="w-5 h-5 rounded-full"
            style={{
              borderWidth: 2,
              borderColor: isDark ? '#3F3F46' : '#D1D5DB',
            }}
          />
        )}

        <Text className="text-xs text-muted-foreground w-5 text-center">
          {String(index + 1).padStart(2, '0')}
        </Text>

        <Text className="flex-1 text-base font-semibold text-foreground">
          {rule.title}
        </Text>

        <ChevronDown
          size={16}
          color={isOpen ? '#818CF8' : isDark ? '#52525B' : '#A1A1AA'}
          style={{
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
          }}
        />
      </Pressable>

      {isOpen && (
        <View className="px-4 pb-4">
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: isDark ? 'rgba(39,39,42,0.3)' : '#F3F4F6',
              paddingTop: 12,
            }}
          >
            <GrammarExplanation text={rule.explanation} />
          </View>

          {rule.pattern ? (
            <View
              className="rounded-lg p-3 mt-3"
              style={{
                backgroundColor: isDark
                  ? 'rgba(129,140,248,0.06)'
                  : 'rgba(129,140,248,0.04)',
                borderWidth: 1,
                borderColor: isDark
                  ? 'rgba(129,140,248,0.12)'
                  : 'rgba(129,140,248,0.08)',
              }}
            >
              <Text className="text-sm font-mono" style={{ color: '#818CF8' }}>
                {rule.pattern}
              </Text>
            </View>
          ) : null}

          {rule.notes ? (
            <View
              className="flex-row items-start gap-2.5 rounded-lg p-3 mt-3"
              style={{
                backgroundColor: 'rgba(245,158,11,0.03)',
                borderWidth: 1,
                borderColor: 'rgba(245,158,11,0.08)',
                borderLeftWidth: 3,
                borderLeftColor: '#F59E0B',
              }}
            >
              <Text className="text-sm mt-px">💡</Text>
              <View className="flex-1">
                <GrammarTipText text={rule.notes} />
              </View>
            </View>
          ) : null}

          {rule.examples && rule.examples.length > 0 && (
            <View className="mt-3">
              <View className="flex-row items-center gap-1.5 mb-2">
                <BookOpen size={12} color={isDark ? '#52525B' : '#9CA3AF'} />
                <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Examples
                </Text>
              </View>
              {rule.examples.map(ex => (
                <ExampleCard key={ex.id} example={ex} />
              ))}
            </View>
          )}

          <View
            className="flex-row items-center justify-between mt-3 pt-3"
            style={{
              borderTopWidth: 1,
              borderTopColor: isDark ? 'rgba(39,39,42,0.3)' : '#F3F4F6',
            }}
          >
            <View className="flex-row items-center gap-1.5">
              <RefreshCw size={11} color={isDark ? '#52525B' : '#9CA3AF'} />
              <Text className="text-xs text-muted-foreground">
                {rule.progress?.practice_count || 0} practice sessions
              </Text>
            </View>
            <Pressable
              className="flex-row items-center gap-1.5 rounded-lg px-3 py-1.5 active:opacity-80"
              style={
                understood
                  ? {
                      backgroundColor: 'rgba(16,185,129,0.06)',
                      borderWidth: 1,
                      borderColor: 'rgba(16,185,129,0.15)',
                    }
                  : {
                      backgroundColor: 'rgba(129,140,248,0.06)',
                      borderWidth: 1,
                      borderColor: 'rgba(129,140,248,0.12)',
                    }
              }
              onPress={() => onMarkUnderstood(rule.id, !understood)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" />
              ) : (
                <Check
                  size={13}
                  color={understood ? '#10B981' : '#818CF8'}
                  strokeWidth={2}
                />
              )}
              <Text
                className="text-xs font-semibold"
                style={{ color: understood ? '#10B981' : '#818CF8' }}
              >
                {understood ? 'Understood' : 'Mark Understood'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function VocabularyTab({
  vocabulary,
  isDark,
}: {
  vocabulary: TopicContentData['vocabulary'];
  isDark: boolean;
}) {
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <View className="py-12 items-center">
        <Text className="text-sm text-muted-foreground">
          No vocabulary linked to this topic yet
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {vocabulary.map(vocab => (
        <View
          key={vocab.id}
          className="rounded-xl p-4"
          style={{
            backgroundColor: isDark ? '#111113' : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDark ? '#27272A' : '#E7E5E4',
          }}
        >
          <View className="flex-row items-start justify-between gap-2">
            <View>
              <Text className="text-lg font-semibold text-foreground">
                {vocab.word}
              </Text>
              {vocab.pronunciation ? (
                <Text className="text-xs text-muted-foreground font-mono">
                  {vocab.pronunciation}
                </Text>
              ) : null}
            </View>
            <View className="flex-row items-center gap-2">
              <View
                className="rounded-full px-2 py-0.5"
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? '#27272A' : '#E7E5E4',
                }}
              >
                <Text className="text-[10px] text-muted-foreground">
                  {vocab.progress?.status || 'new'}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-2 mt-2">
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: isDark ? '#27272A' : '#F3F4F6' }}
            >
              <Text className="text-[10px] text-muted-foreground">
                {vocab.part_of_speech}
              </Text>
            </View>
            {vocab.translation ? (
              <Text className="text-sm text-muted-foreground">
                {vocab.translation}
              </Text>
            ) : null}
          </View>
          {vocab.example_sentence ? (
            <Text className="text-sm text-muted-foreground mt-2 italic">
              &ldquo;{vocab.example_sentence}&rdquo;
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

export default function GrammarTopicScreen() {
  const { t } = useTranslation();
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    data: content,
    isLoading,
    error,
  } = useGetTopicContentQuery({ topicId: topicId ?? '' }, { skip: !topicId });

  const [updateTopicProgress] = useUpdateTopicProgressMutation();
  const [updateRuleProgress, { isLoading: isUpdatingRule }] =
    useUpdateRuleProgressMutation();

  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'rules' | 'vocab'>('rules');

  useEffect(() => {
    if (
      content?.rules &&
      content.rules.length > 0 &&
      expandedRules.size === 0
    ) {
      setExpandedRules(new Set([content.rules[0].id]));
    }
  }, [content?.rules]);

  useEffect(() => {
    if (content?.topic && !content.topic.progress && topicId) {
      updateTopicProgress({ topicId, status: 'in_progress' });
    }
  }, [content, topicId, updateTopicProgress]);

  const toggleRule = useCallback((ruleId: string) => {
    setExpandedRules(prev => {
      const next = new Set(prev);
      if (next.has(ruleId)) next.delete(ruleId);
      else next.add(ruleId);
      return next;
    });
  }, []);

  const markRuleUnderstood = useCallback(
    async (ruleId: string, understood: boolean) => {
      await updateRuleProgress({
        ruleId,
        understood,
        quality: understood ? 4 : 2,
      });
    },
    [updateRuleProgress]
  );

  const understoodRules = useMemo(
    () => content?.rules?.filter(r => r.progress?.understood).length ?? 0,
    [content?.rules]
  );
  const totalRules = content?.rules?.length ?? 0;
  const progressPct =
    totalRules > 0 ? Math.round((understoodRules / totalRules) * 100) : 0;
  const topicStatus = content?.topic?.progress?.status ?? 'not_started';

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (error || !content) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-destructive text-center">Topic not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="bg-card rounded-2xl overflow-hidden mb-5">
        <View style={{ height: 3, backgroundColor: '#818CF8' }} />
        <View className="p-5">
          <View className="flex-row items-center justify-between mb-3">
            {content.topic.level_code ? (
              <View
                className="rounded-md px-2.5 py-1"
                style={{
                  backgroundColor: 'rgba(129,140,248,0.06)',
                  borderWidth: 1,
                  borderColor: 'rgba(129,140,248,0.12)',
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{ color: '#818CF8' }}
                >
                  {content.topic.level_code.toUpperCase()}
                </Text>
              </View>
            ) : null}
            <StatusBadge status={topicStatus} />
          </View>

          <Text className="text-2xl font-bold text-foreground mb-1">
            {content.topic.name}
          </Text>
          {content.topic.description ? (
            <Text className="text-sm text-muted-foreground mb-4">
              {content.topic.description}
            </Text>
          ) : null}

          {totalRules > 0 && (
            <View className="flex-row items-center gap-3">
              <View
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: isDark ? '#27272A' : '#E5E7EB' }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPct}%`,
                    backgroundColor: '#818CF8',
                  }}
                />
              </View>
              <Text className="text-xs text-muted-foreground">
                {understoodRules} / {totalRules} rules
              </Text>
            </View>
          )}

          <View
            className="flex-row gap-4 mt-4 pt-3"
            style={{
              borderTopWidth: 1,
              borderTopColor: isDark ? 'rgba(39,39,42,0.4)' : '#F3F4F6',
            }}
          >
            <View className="flex-row items-center gap-2">
              <View
                className="w-7 h-7 rounded-lg items-center justify-center"
                style={{ backgroundColor: 'rgba(129,140,248,0.06)' }}
              >
                <BookOpen size={13} color="#818CF8" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-foreground">
                  {totalRules}
                </Text>
                <Text className="text-[10px] text-muted-foreground">Rules</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <View
                className="w-7 h-7 rounded-lg items-center justify-center"
                style={{ backgroundColor: 'rgba(16,185,129,0.06)' }}
              >
                <Check size={13} color="#10B981" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-foreground">
                  {understoodRules}
                </Text>
                <Text className="text-[10px] text-muted-foreground">
                  Understood
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        className="flex-row rounded-xl overflow-hidden mb-5"
        style={{
          backgroundColor: isDark ? '#111113' : '#FFFFFF',
          borderWidth: 1,
          borderColor: isDark ? '#27272A' : '#E7E5E4',
        }}
      >
        <Pressable
          className="flex-1 flex-row items-center justify-center gap-1.5 py-3"
          style={{
            backgroundColor:
              activeTab === 'rules'
                ? isDark
                  ? '#1C1C1E'
                  : '#F3F4F6'
                : 'transparent',
          }}
          onPress={() => setActiveTab('rules')}
        >
          <BookOpen
            size={15}
            color={
              activeTab === 'rules'
                ? isDark
                  ? '#FAFAF9'
                  : '#111827'
                : isDark
                  ? '#52525B'
                  : '#A1A1AA'
            }
          />
          <Text
            className={`text-sm font-medium ${
              activeTab === 'rules'
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Rules
          </Text>
          <View
            className="rounded-full px-1.5 py-px"
            style={{
              backgroundColor:
                activeTab === 'rules'
                  ? 'rgba(129,140,248,0.1)'
                  : isDark
                    ? '#27272A'
                    : '#E5E7EB',
            }}
          >
            <Text
              className="text-[10px]"
              style={{
                color: activeTab === 'rules' ? '#818CF8' : '#6B7280',
              }}
            >
              {totalRules}
            </Text>
          </View>
        </Pressable>

        <Pressable
          className="flex-1 flex-row items-center justify-center gap-1.5 py-3"
          style={{
            backgroundColor:
              activeTab === 'vocab'
                ? isDark
                  ? '#1C1C1E'
                  : '#F3F4F6'
                : 'transparent',
          }}
          onPress={() => setActiveTab('vocab')}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === 'vocab'
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Vocabulary
          </Text>
          <View
            className="rounded-full px-1.5 py-px"
            style={{
              backgroundColor:
                activeTab === 'vocab'
                  ? 'rgba(129,140,248,0.1)'
                  : isDark
                    ? '#27272A'
                    : '#E5E7EB',
            }}
          >
            <Text
              className="text-[10px]"
              style={{
                color: activeTab === 'vocab' ? '#818CF8' : '#6B7280',
              }}
            >
              {content.vocabulary?.length ?? 0}
            </Text>
          </View>
        </Pressable>
      </View>

      {activeTab === 'rules' && (
        <View>
          {content.rules?.map((rule, index) => (
            <RuleAccordion
              key={rule.id}
              rule={rule}
              index={index}
              isOpen={expandedRules.has(rule.id)}
              onToggle={() => toggleRule(rule.id)}
              onMarkUnderstood={markRuleUnderstood}
              isUpdating={isUpdatingRule}
              isDark={isDark}
            />
          ))}

          {(!content.rules || content.rules.length === 0) && (
            <View
              className="rounded-2xl py-12 items-center"
              style={{
                backgroundColor: isDark ? '#111113' : '#FFFFFF',
                borderWidth: 1,
                borderColor: isDark ? '#27272A' : '#E7E5E4',
              }}
            >
              <BookOpen size={32} color={isDark ? '#52525B' : '#A1A1AA'} />
              <Text className="text-sm text-muted-foreground mt-3">
                No grammar rules available for this topic yet.
              </Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'vocab' && (
        <VocabularyTab vocabulary={content.vocabulary} isDark={isDark} />
      )}

      {totalRules > 0 && understoodRules === totalRules && (
        <View
          className="rounded-2xl py-6 items-center mt-5"
          style={{
            backgroundColor: 'rgba(16,185,129,0.03)',
            borderWidth: 1,
            borderColor: 'rgba(16,185,129,0.15)',
          }}
        >
          <Check size={32} color="#10B981" />
          <Text
            className="text-lg font-semibold mt-2"
            style={{ color: '#10B981' }}
          >
            Great job!
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">
            You&apos;ve understood all the rules in this topic.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
