import React from 'react';

import { View } from 'react-native';

import { GrammarLevelsScreen } from '@/features/grammar';

export default function GrammarTab() {
  return (
    <View className="flex-1">
      <GrammarLevelsScreen />
    </View>
  );
}
