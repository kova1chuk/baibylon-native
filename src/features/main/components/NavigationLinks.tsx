import React from 'react';

import { useRouter } from 'expo-router';

import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

export default function NavigationLinks() {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navButton, { backgroundColor: '#6B7280' }]}
        onPress={() => handleNavigation('/dictionary')}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.buttonText}>Dictionary</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, { backgroundColor: '#3B82F6' }]}
        onPress={() => handleNavigation('/training')}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.buttonText}>Training Words</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, { backgroundColor: '#10B981' }]}
        onPress={() => handleNavigation('/reviews')}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.buttonText}>Reviews</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
