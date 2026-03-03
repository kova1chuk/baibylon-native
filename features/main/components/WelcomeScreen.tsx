import React, { useEffect } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { View, Text, ScrollView, Pressable } from "react-native";

import { useAuth } from "@/contexts/AuthContext";

import { useColors } from "@/hooks/useColors";

import DashboardScreen from "./DashboardScreen";

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, session, loading } = useAuth();
  const colors = useColors();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/auth/signin");
    }
  }, [session, loading, router]);

  const handleGetStarted = () => {
    router.push("/auth/signin");
  };

  const handleCreateAccount = () => {
    router.push("/auth/signup");
  };

  if (loading) {
    return null;
  }

  if (session && user) {
    return <DashboardScreen />;
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      {/* Hero section */}
      <View className="items-center mb-6">
        <View className="relative mb-5">
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 48 }}>📚</Text>
          </LinearGradient>

          <View className="absolute w-6 h-6 rounded-full bg-yellow-400 -top-2 -right-2" />
          <View className="absolute w-4 h-4 rounded-full bg-primary -bottom-2 -left-2" />
        </View>

        <Text className="text-4xl font-bold text-center mb-3 text-foreground leading-[44px]">
          Welcome to Vocairo
        </Text>

        <Text className="text-xl text-center mb-5 leading-[26px] px-4 opacity-80 text-foreground">
          Master vocabulary through intelligent analysis, personalized training, and seamless
          learning experiences
        </Text>
      </View>

      {/* Feature cards */}
      <View className="gap-4 mb-6">
        {[
          {
            emoji: "📊",
            title: "Smart Analysis",
            desc: "Upload texts and get intelligent word analysis with difficulty levels and learning recommendations",
          },
          {
            emoji: "⚡",
            title: "Interactive Training",
            desc: "Engage with various training modes including quizzes, translations, and context exercises",
          },
          {
            emoji: "📈",
            title: "Progress Tracking",
            desc: "Monitor your learning progress with detailed statistics and personalized insights",
          },
        ].map((card) => (
          <View key={card.title} className="bg-card rounded-2xl p-5 shadow-sm">
            <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center mb-4 self-center">
              <Text style={{ fontSize: 24 }}>{card.emoji}</Text>
            </View>
            <Text className="text-xl font-semibold mb-2 text-center text-foreground">
              {card.title}
            </Text>
            <Text className="text-base leading-5 text-center opacity-80 text-foreground">
              {card.desc}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA buttons */}
      <View className="items-center gap-4">
        <View className="gap-4 mb-4 w-full">
          <Pressable
            className="bg-primary rounded-xl py-4 items-center active:opacity-80"
            onPress={handleGetStarted}
          >
            <Text className="text-white font-semibold text-lg">Get Started</Text>
          </Pressable>

          <Pressable
            className="border-2 border-border rounded-xl py-4 items-center active:opacity-80"
            onPress={handleCreateAccount}
          >
            <Text className="text-foreground font-semibold text-lg">Create Account</Text>
          </Pressable>
        </View>

        <Text className="text-sm text-center opacity-70 text-foreground">
          Join thousands of learners improving their vocabulary with Vocairo
        </Text>
      </View>
    </ScrollView>
  );
}
