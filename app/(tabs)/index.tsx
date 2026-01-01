import React from 'react';

import { View } from 'tamagui';

import { WelcomeScreen } from '@/features/main';

export default function HomeScreen() {
  // For now, show the welcome screen
  // TODO: Implement authentication check and show dashboard for authenticated users
  return (
    <View flex={1}>
      <WelcomeScreen />
    </View>
  );
}
