import React from 'react';

import { View } from 'tamagui';

import { WelcomeScreen } from '@/features/main';

export default function HomeScreen() {
  return (
    <View flex={1}>
      <WelcomeScreen />
    </View>
  );
}
