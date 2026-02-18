import React from 'react';

import {
  ChevronRight,
  BookOpen,
  GraduationCap,
  RotateCcw,
  Bot,
} from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import {
  Button,
  Text,
  View,
  XStack,
  YStack,
  useTheme as useTamaguiTheme,
} from 'tamagui';

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

export default function QuickActions() {
  const router = useRouter();
  const tamaguiTheme = useTamaguiTheme();

  const actions: ActionItem[] = [
    {
      label: 'Start Training',
      icon: <GraduationCap size={20} color="#10B981" />,
      route: '/training',
      color: '#10B981',
    },
    {
      label: 'Dictionary',
      icon: <BookOpen size={20} color="#3B82F6" />,
      route: '/(tabs)/explore',
      color: '#3B82F6',
    },
    {
      label: 'Add Review',
      icon: <RotateCcw size={20} color="#F59E0B" />,
      route: '/reviews',
      color: '#F59E0B',
    },
    {
      label: 'AI Tutor',
      icon: <Bot size={20} color="#8B5CF6" />,
      route: '',
      color: '#8B5CF6',
    },
  ];

  return (
    <YStack
      backgroundColor="$background"
      borderRadius="$4"
      padding="$4"
      marginHorizontal="$4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={2}
      elevation={1}
    >
      <Text fontSize="$5" fontWeight="600" color="$color" marginBottom="$3">
        Quick Actions
      </Text>

      <YStack gap="$2">
        {actions.map(action => (
          <Button
            key={action.label}
            size="$4"
            backgroundColor="transparent"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$3"
            onPress={() => action.route && router.push(action.route as any)}
            disabled={!action.route}
            opacity={action.route ? 1 : 0.5}
            justifyContent="flex-start"
            paddingHorizontal="$3"
          >
            <XStack flex={1} alignItems="center" gap="$3">
              <View
                width={36}
                height={36}
                borderRadius={10}
                backgroundColor={`${action.color}15`}
                alignItems="center"
                justifyContent="center"
              >
                {action.icon}
              </View>
              <Text flex={1} fontSize="$4" fontWeight="500" color="$color">
                {action.label}
              </Text>
              <ChevronRight
                size={16}
                color={tamaguiTheme.color?.val}
                opacity={0.4}
              />
            </XStack>
          </Button>
        ))}
      </YStack>
    </YStack>
  );
}
