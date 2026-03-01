import React from 'react';

import { useRouter } from 'expo-router';

import { View, Text, Pressable } from 'react-native';

export default function NavigationLinks() {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <View className="gap-4 w-full">
      <Pressable
        className="bg-muted rounded-xl py-3 items-center active:opacity-80"
        onPress={() => handleNavigation('/dictionary')}
      >
        <Text className="text-foreground font-semibold text-base">
          Dictionary
        </Text>
      </Pressable>

      <Pressable
        className="bg-primary rounded-xl py-3 items-center active:opacity-80"
        onPress={() => handleNavigation('/training')}
      >
        <Text className="text-white font-semibold text-base">
          Training Words
        </Text>
      </Pressable>

      <Pressable
        className="bg-primary rounded-xl py-3 items-center active:opacity-80"
        onPress={() => handleNavigation('/reviews')}
      >
        <Text className="text-white font-semibold text-base">Reviews</Text>
      </Pressable>
    </View>
  );
}
