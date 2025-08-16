import React, { useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { useColorScheme } from '@/hooks/useColorScheme';

import { colors } from '../../../shared/config/colors';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const isDark = colorScheme === 'dark';
  const themeColors = colors;

  const handleGetStarted = () => {
    router.push('/auth/signin');
  };

  const handleCreateAccount = () => {
    router.push('/auth/signup');
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? themeColors.background.page.dark
            : themeColors.background.page.light,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        {/* Animated Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={
              isDark
                ? [themeColors.primary.dark, themeColors.primary.hover]
                : [themeColors.primary.light, themeColors.primary.hover]
            }
            style={[
              styles.iconBackground,
              { transform: [{ scale: isPressed ? 1.1 : 1 }] },
            ]}
          >
            <Text style={styles.iconText}>📚</Text>
          </LinearGradient>

          {/* Floating elements */}
          <View style={[styles.floatingElement, styles.floatingElement1]} />
          <View style={[styles.floatingElement, styles.floatingElement2]} />
        </View>

        {/* Main Heading */}
        <ThemedText type="title" style={styles.mainHeading}>
          Welcome to Word Flow
        </ThemedText>

        {/* Subtitle */}
        <ThemedText style={styles.subtitle}>
          Master vocabulary through intelligent analysis, personalized training,
          and seamless learning experiences
        </ThemedText>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresGrid}>
        {/* Smart Analysis */}
        <View
          style={[
            styles.featureCard,
            {
              backgroundColor: isDark
                ? themeColors.background.card.dark
                : themeColors.background.card.light,
            },
          ]}
        >
          <View
            style={[
              styles.featureIcon,
              {
                backgroundColor: isDark
                  ? themeColors.features.analysis.icon.dark
                  : themeColors.features.analysis.icon.light,
              },
            ]}
          >
            <Text
              style={[
                styles.featureIconText,
                {
                  color: isDark
                    ? themeColors.features.analysis.text.dark
                    : themeColors.features.analysis.text.light,
                },
              ]}
            >
              📊
            </Text>
          </View>
          <ThemedText type="subtitle" style={styles.featureTitle}>
            Smart Analysis
          </ThemedText>
          <ThemedText style={styles.featureDescription}>
            Upload texts and get intelligent word analysis with difficulty
            levels and learning recommendations
          </ThemedText>
        </View>

        {/* Interactive Training */}
        <View
          style={[
            styles.featureCard,
            {
              backgroundColor: isDark
                ? themeColors.background.card.dark
                : themeColors.background.card.light,
            },
          ]}
        >
          <View
            style={[
              styles.featureIcon,
              {
                backgroundColor: isDark
                  ? themeColors.features.training.icon.dark
                  : themeColors.features.training.icon.light,
              },
            ]}
          >
            <Text
              style={[
                styles.featureIconText,
                {
                  color: isDark
                    ? themeColors.features.training.text.dark
                    : themeColors.features.training.text.light,
                },
              ]}
            >
              ⚡
            </Text>
          </View>
          <ThemedText type="subtitle" style={styles.featureTitle}>
            Interactive Training
          </ThemedText>
          <ThemedText style={styles.featureDescription}>
            Engage with various training modes including quizzes, translations,
            and context exercises
          </ThemedText>
        </View>

        {/* Progress Tracking */}
        <View
          style={[
            styles.featureCard,
            {
              backgroundColor: isDark
                ? themeColors.background.card.dark
                : themeColors.background.card.light,
            },
          ]}
        >
          <View
            style={[
              styles.featureIcon,
              {
                backgroundColor: isDark
                  ? themeColors.features.progress.icon.dark
                  : themeColors.features.progress.icon.light,
              },
            ]}
          >
            <Text
              style={[
                styles.featureIconText,
                {
                  color: isDark
                    ? themeColors.features.progress.text.dark
                    : themeColors.features.progress.text.light,
                },
              ]}
            >
              📈
            </Text>
          </View>
          <ThemedText type="subtitle" style={styles.featureTitle}>
            Progress Tracking
          </ThemedText>
          <ThemedText style={styles.featureDescription}>
            Monitor your learning progress with detailed statistics and
            personalized insights
          </ThemedText>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: themeColors.button.primary.background },
            ]}
            onPress={handleGetStarted}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.buttonText,
                { color: themeColors.button.primary.text },
              ]}
            >
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { borderColor: themeColors.button.secondary.border },
            ]}
            onPress={handleCreateAccount}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: isDark
                    ? themeColors.button.secondary.text.dark
                    : themeColors.button.secondary.text.light,
                },
              ]}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.ctaSubtext}>
          Join thousands of learners improving their vocabulary with Word Flow
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  iconBackground: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: 48,
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 999,
  },
  floatingElement1: {
    width: 24,
    height: 24,
    backgroundColor: '#FBBF24',
    top: -8,
    right: -8,
  },
  floatingElement2: {
    width: 16,
    height: 16,
    backgroundColor: '#34D399',
    bottom: -8,
    left: -8,
  },
  mainHeading: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    marginBottom: 40,
  },
  featureCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  featureIconText: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  ctaSection: {
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
    width: '100%',
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  ctaSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});
