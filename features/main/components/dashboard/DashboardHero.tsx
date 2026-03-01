import React from 'react';

import { View, Text } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardHero() {
  const { user } = useAuth();
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Learner';

  return (
    <View className="gap-1 px-4">
      <Text className="text-3xl font-bold text-foreground">
        {getGreeting()}, {name}
      </Text>
      <Text className="text-base text-muted-foreground">
        {"Let's continue building your vocabulary"}
      </Text>
    </View>
  );
}
