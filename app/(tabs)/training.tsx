import React, { useState } from 'react';

import { View } from 'react-native';

import { TrainingScreen } from '@/features/training';
import TrainingHubScreen from '@/features/training/components/TrainingHubScreen';

export default function TrainingTab() {
  const [showSession, setShowSession] = useState(false);

  if (showSession) {
    return (
      <View className="flex-1">
        <TrainingScreen onBack={() => setShowSession(false)} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <TrainingHubScreen onStartSession={() => setShowSession(true)} />
    </View>
  );
}
