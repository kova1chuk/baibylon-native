import React, { useEffect } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { View, Text, ScrollView, YStack, Button } from 'tamagui';

import { useAuth } from '@/contexts/AuthContext';

import DashboardScreen from './DashboardScreen';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/auth/signin');
    }
  }, [session, loading, router]);

  const handleGetStarted = () => {
    router.push('/auth/signin');
  };

  const handleCreateAccount = () => {
    router.push('/auth/signup');
  };

  if (loading) {
    return null;
  }

  if (session && user) {
    return <DashboardScreen />;
  }

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      contentContainerStyle={{
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      {}
      <YStack alignItems="center" marginBottom="$6">
        {}
        <YStack position="relative" marginBottom="$5">
          <LinearGradient
            colors={['$blue10', '$blue11']}
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text fontSize={48}>📚</Text>
          </LinearGradient>

          {}
          <View
            position="absolute"
            width={24}
            height={24}
            borderRadius={999}
            backgroundColor="$yellow10"
            top={-8}
            right={-8}
          />
          <View
            position="absolute"
            width={16}
            height={16}
            borderRadius={999}
            backgroundColor="$green10"
            bottom={-8}
            left={-8}
          />
        </YStack>

        {}
        <Text
          fontSize="$10"
          fontWeight="bold"
          textAlign="center"
          marginBottom="$3"
          lineHeight={44}
        >
          Welcome to Baibylon
        </Text>

        {}
        <Text
          fontSize="$6"
          textAlign="center"
          marginBottom="$5"
          lineHeight={26}
          paddingHorizontal="$4"
          opacity={0.8}
        >
          Master vocabulary through intelligent analysis, personalized training,
          and seamless learning experiences
        </Text>
      </YStack>

      {}
      <YStack gap="$4" marginBottom="$6">
        {}
        <YStack
          backgroundColor="$background"
          padding="$5"
          borderRadius="$4"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={4}
        >
          <YStack
            width={48}
            height={48}
            borderRadius="$3"
            backgroundColor="$blue3"
            alignItems="center"
            justifyContent="center"
            marginBottom="$4"
            alignSelf="center"
          >
            <Text fontSize={24}>📊</Text>
          </YStack>
          <Text
            fontSize="$6"
            fontWeight="600"
            marginBottom="$2"
            textAlign="center"
          >
            Smart Analysis
          </Text>
          <Text fontSize="$4" lineHeight={20} textAlign="center" opacity={0.8}>
            Upload texts and get intelligent word analysis with difficulty
            levels and learning recommendations
          </Text>
        </YStack>

        {}
        <YStack
          backgroundColor="$background"
          padding="$5"
          borderRadius="$4"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={4}
        >
          <YStack
            width={48}
            height={48}
            borderRadius="$3"
            backgroundColor="$green3"
            alignItems="center"
            justifyContent="center"
            marginBottom="$4"
            alignSelf="center"
          >
            <Text fontSize={24}>⚡</Text>
          </YStack>
          <Text
            fontSize="$6"
            fontWeight="600"
            marginBottom="$2"
            textAlign="center"
          >
            Interactive Training
          </Text>
          <Text fontSize="$4" lineHeight={20} textAlign="center" opacity={0.8}>
            Engage with various training modes including quizzes, translations,
            and context exercises
          </Text>
        </YStack>

        {}
        <YStack
          backgroundColor="$background"
          padding="$5"
          borderRadius="$4"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={4}
        >
          <YStack
            width={48}
            height={48}
            borderRadius="$3"
            backgroundColor="$purple3"
            alignItems="center"
            justifyContent="center"
            marginBottom="$4"
            alignSelf="center"
          >
            <Text fontSize={24}>📈</Text>
          </YStack>
          <Text
            fontSize="$6"
            fontWeight="600"
            marginBottom="$2"
            textAlign="center"
          >
            Progress Tracking
          </Text>
          <Text fontSize="$4" lineHeight={20} textAlign="center" opacity={0.8}>
            Monitor your learning progress with detailed statistics and
            personalized insights
          </Text>
        </YStack>
      </YStack>

      {}
      <YStack alignItems="center" gap="$4">
        <YStack gap="$4" marginBottom="$4" width="100%">
          <Button
            size="$5"
            backgroundColor="$blue10"
            color="white"
            fontWeight="600"
            onPress={handleGetStarted}
          >
            Get Started
          </Button>

          <Button
            size="$5"
            borderColor="$borderColor"
            borderWidth={2}
            backgroundColor="transparent"
            onPress={handleCreateAccount}
          >
            Create Account
          </Button>
        </YStack>

        <Text fontSize="$3" textAlign="center" opacity={0.7}>
          Join thousands of learners improving their vocabulary with Baibylon
        </Text>
      </YStack>
    </ScrollView>
  );
}
