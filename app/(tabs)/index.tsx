import React from 'react';

import { StyleSheet } from 'react-native';

import { WelcomeScreen } from '@/src/features/main';

import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  // For now, show the welcome screen
  // TODO: Implement authentication check and show dashboard for authenticated users
  return (
    <ThemedView style={styles.container}>
      <WelcomeScreen />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
