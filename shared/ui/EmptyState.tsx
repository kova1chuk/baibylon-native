import React from 'react';

import { View, Text } from 'react-native';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-20 px-8">
      {icon}
      <Text className="text-base font-medium text-muted-foreground mt-4 text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-muted-foreground mt-1 text-center">
          {description}
        </Text>
      )}
    </View>
  );
}
