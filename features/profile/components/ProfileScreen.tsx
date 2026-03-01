import React, { useState } from 'react';

import { useRouter } from 'expo-router';

import { View, ScrollView, Text, Pressable, Switch, Alert } from 'react-native';

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

  const userName =
    user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="gap-4 p-4">
        {/* Profile header */}
        <View className="gap-3 items-center p-6 rounded-2xl mb-5 bg-card shadow-sm">
          <View className="mb-4">
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
              <Text className="text-4xl font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-bold text-foreground">{userName}</Text>
          <Text className="text-base text-muted-foreground mb-4">
            {userEmail}
          </Text>
          <Pressable
            className="border border-border rounded-xl py-3 px-6 active:opacity-80"
            onPress={handleEditProfile}
          >
            <Text className="text-foreground font-medium">Edit Profile</Text>
          </Pressable>
        </View>

        {/* Settings */}
        <View className="gap-2 p-5 rounded-2xl mb-5 bg-card shadow-sm">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Settings
          </Text>

          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <View className="flex-1 mr-4">
              <Text className="text-base font-medium text-foreground mb-1">
                Notifications
              </Text>
              <Text className="text-sm text-muted-foreground">
                Receive learning reminders and updates
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-1 mr-4">
              <Text className="text-base font-medium text-foreground mb-1">
                Dark Mode
              </Text>
              <Text className="text-sm text-muted-foreground">
                Use dark theme for better readability
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={value => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Learning stats */}
        <View className="gap-4 p-5 rounded-2xl mb-5 bg-card shadow-sm">
          <Text className="text-xl font-semibold text-foreground">
            Learning Stats
          </Text>
          <View className="flex-row justify-around">
            {[
              { value: '0', label: 'Words Learned' },
              { value: '0', label: 'Training Sessions' },
              { value: '0', label: 'Days Streak' },
            ].map(item => (
              <View key={item.label} className="items-center">
                <Text className="text-2xl font-bold text-foreground mb-1">
                  {item.value}
                </Text>
                <Text className="text-xs text-muted-foreground text-center">
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sign out */}
        <Pressable
          className="bg-destructive rounded-xl py-4 items-center active:opacity-80"
          onPress={handleSignOut}
        >
          <Text className="text-white font-semibold text-base">Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
