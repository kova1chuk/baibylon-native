import React, { useState } from 'react';

import { useRouter } from 'expo-router';
import {
  View,
  ScrollView,
  Text,
  YStack,
  XStack,
  Button,
  Switch,
} from 'tamagui';

import { Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const isDark = theme === 'dark';

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          router.replace('/auth/signin');
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Info', 'Edit profile functionality coming soon!');
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotificationsEnabled(value);
  };

  const handleDarkModeToggle = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const userName =
    user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack gap="$4" padding="$4">
        {}
        <YStack
          gap="$3"
          alignItems="center"
          padding="$6"
          borderRadius="$4"
          marginBottom="$5"
          backgroundColor="$background"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={4}
        >
          <YStack marginBottom="$4">
            <View
              width={80}
              height={80}
              borderRadius={40}
              backgroundColor="$blue10"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="$10" fontWeight="bold" color="white">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </YStack>
          <Text fontSize="$8" fontWeight="bold" color="$color">
            {userName}
          </Text>
          <Text fontSize="$4" opacity={0.7} marginBottom="$4" color="$color">
            {userEmail}
          </Text>
          <Button
            size="$4"
            borderColor="$borderColor"
            borderWidth={1}
            backgroundColor="transparent"
            color="$color"
            fontWeight="500"
            onPress={handleEditProfile}
          >
            Edit Profile
          </Button>
        </YStack>

        {}
        <YStack
          gap="$2"
          padding="$5"
          borderRadius="$4"
          marginBottom="$5"
          backgroundColor="$background"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={4}
        >
          <Text fontSize="$6" fontWeight="600" marginBottom="$4" color="$color">
            Settings
          </Text>

          {}
          <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingVertical="$3"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <YStack flex={1} marginRight="$4">
              <Text
                fontSize="$4"
                fontWeight="500"
                marginBottom="$1"
                color="$color"
              >
                Notifications
              </Text>
              <Text fontSize="$3" opacity={0.7} color="$color">
                Receive learning reminders and updates
              </Text>
            </YStack>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationsToggle}
              size="$4"
            />
          </XStack>

          {}
          <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingVertical="$3"
          >
            <YStack flex={1} marginRight="$4">
              <Text
                fontSize="$4"
                fontWeight="500"
                marginBottom="$1"
                color="$color"
              >
                Dark Mode
              </Text>
              <Text fontSize="$3" opacity={0.7} color="$color">
                Use dark theme for better readability
              </Text>
            </YStack>
            <Switch
              checked={isDark}
              onCheckedChange={handleDarkModeToggle}
              size="$4"
            />
          </XStack>
        </YStack>

        {}
        <YStack
          gap="$4"
          padding="$5"
          borderRadius="$4"
          marginBottom="$5"
          backgroundColor="$background"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={4}
        >
          <Text fontSize="$6" fontWeight="600" color="$color">
            Learning Stats
          </Text>
          <XStack justifyContent="space-around">
            <YStack alignItems="center">
              <Text
                fontSize="$8"
                fontWeight="bold"
                marginBottom="$1"
                color="$color"
              >
                0
              </Text>
              <Text
                fontSize="$2"
                opacity={0.7}
                textAlign="center"
                color="$color"
              >
                Words Learned
              </Text>
            </YStack>
            <YStack alignItems="center">
              <Text
                fontSize="$8"
                fontWeight="bold"
                marginBottom="$1"
                color="$color"
              >
                0
              </Text>
              <Text
                fontSize="$2"
                opacity={0.7}
                textAlign="center"
                color="$color"
              >
                Training Sessions
              </Text>
            </YStack>
            <YStack alignItems="center">
              <Text
                fontSize="$8"
                fontWeight="bold"
                marginBottom="$1"
                color="$color"
              >
                0
              </Text>
              <Text
                fontSize="$2"
                opacity={0.7}
                textAlign="center"
                color="$color"
              >
                Days Streak
              </Text>
            </YStack>
          </XStack>
        </YStack>

        {}
        <Button
          size="$5"
          backgroundColor="$red10"
          color="white"
          fontWeight="600"
          onPress={handleSignOut}
        >
          Sign Out
        </Button>
      </YStack>
    </ScrollView>
  );
}
