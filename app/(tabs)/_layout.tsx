import React from 'react';

import { Redirect, Tabs } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';

import { CustomTabBar } from '@/components/ui/CustomTabBar';

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/auth/signin" />;

  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="ai-tutor" />
      <Tabs.Screen name="grammar" />
      <Tabs.Screen name="training" />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
