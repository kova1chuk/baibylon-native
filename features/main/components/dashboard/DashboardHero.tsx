import React from 'react';

import { Text, YStack } from 'tamagui';

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
    <YStack gap="$1" paddingHorizontal="$4">
      <Text fontSize="$9" fontWeight="bold" color="$color">
        {getGreeting()}, {name}
      </Text>
      <Text fontSize="$4" opacity={0.6}>
        {"Let's continue building your vocabulary"}
      </Text>
    </YStack>
  );
}
