import React from 'react';

import { useRouter } from 'expo-router';
import { YStack, Button } from 'tamagui';

export default function NavigationLinks() {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <YStack gap="$4" width="100%">
      <Button
        size="$4"
        backgroundColor="$gray10"
        color="white"
        fontWeight="600"
        onPress={() => handleNavigation('/dictionary')}
      >
        Dictionary
      </Button>

      <Button
        size="$4"
        backgroundColor="$blue10"
        color="white"
        fontWeight="600"
        onPress={() => handleNavigation('/training')}
      >
        Training Words
      </Button>

      <Button
        size="$4"
        backgroundColor="$green10"
        color="white"
        fontWeight="600"
        onPress={() => handleNavigation('/reviews')}
      >
        Reviews
      </Button>
    </YStack>
  );
}
