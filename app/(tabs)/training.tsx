import React, { useState } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from 'react-native';

import DashboardHeader from '@/features/main/components/dashboard/DashboardHeader';
import { TrainingScreen } from '@/features/training';
import TrainingHubScreen from '@/features/training/components/TrainingHubScreen';

import { useColors } from '@/hooks/useColors';

export default function TrainingTab() {
  const [showSession, setShowSession] = useState(false);
  const insets = useSafeAreaInsets();
  const colors = useColors();

  if (showSession) {
    return (
      <View style={{ flex: 1 }}>
        <TrainingScreen onBack={() => setShowSession(false)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <DashboardHeader insetTop={insets.top} />
      <TrainingHubScreen onStartSession={() => setShowSession(true)} />
    </View>
  );
}
