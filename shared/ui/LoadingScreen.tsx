import React from 'react';

import { useTranslation } from 'react-i18next';

import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" />
      <Text className="text-muted-foreground mt-3">
        {message || t('common.loading')}
      </Text>
    </View>
  );
}
