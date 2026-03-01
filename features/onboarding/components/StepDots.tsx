import React from 'react';

import { View } from 'react-native';

interface StepDotsProps {
  current: number;
  total: number;
}

export default function StepDots({ current, total }: StepDotsProps) {
  return (
    <View className="flex-row items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className="h-1.5 rounded-full"
          style={{
            width: i === current ? 24 : 6,
            backgroundColor:
              i <= current ? '#818cf8' : 'rgba(255,255,255,0.15)',
          }}
        />
      ))}
    </View>
  );
}
