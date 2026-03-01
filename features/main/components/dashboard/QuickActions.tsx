import React from 'react';

import { useRouter } from 'expo-router';
import {
  ChevronRight,
  BookOpen,
  GraduationCap,
  RotateCcw,
  Bot,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { View, Text, Pressable } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

interface ActionItem {
  labelKey: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

export default function QuickActions() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const actions: ActionItem[] = [
    {
      labelKey: 'dashboard.startTraining',
      icon: <GraduationCap size={20} color="#10B981" />,
      route: '/training',
      color: '#10B981',
    },
    {
      labelKey: 'nav.dictionary',
      icon: <BookOpen size={20} color="#3B82F6" />,
      route: '/(tabs)/explore',
      color: '#3B82F6',
    },
    {
      labelKey: 'dashboard.addReview',
      icon: <RotateCcw size={20} color="#F59E0B" />,
      route: '/reviews',
      color: '#F59E0B',
    },
    {
      labelKey: 'nav.aiTutor',
      icon: <Bot size={20} color="#8B5CF6" />,
      route: '',
      color: '#8B5CF6',
    },
  ];

  return (
    <View className="bg-card rounded-2xl p-4 mx-4 shadow-sm">
      <Text className="text-lg font-semibold text-foreground mb-3">
        {t('dashboard.quickActions')}
      </Text>

      <View className="gap-2">
        {actions.map(action => (
          <Pressable
            key={action.labelKey}
            className="flex-row items-center gap-3 px-3 py-3 border border-border rounded-xl active:opacity-70"
            onPress={() => action.route && router.push(action.route as any)}
            disabled={!action.route}
            style={{ opacity: action.route ? 1 : 0.5 }}
          >
            <View
              className="w-9 h-9 rounded-[10px] items-center justify-center"
              style={{ backgroundColor: `${action.color}15` }}
            >
              {action.icon}
            </View>
            <Text className="flex-1 text-base font-medium text-foreground">
              {t(action.labelKey)}
            </Text>
            <ChevronRight
              size={16}
              color={isDark ? '#FAFAF9' : '#111827'}
              opacity={0.4}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
