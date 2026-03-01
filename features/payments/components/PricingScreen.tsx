import React, { useCallback } from 'react';

import {
  Check,
  Crown,
  ExternalLink,
  Minus,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { useGetSubscriptionQuery } from '@/entities/payments/api/subscriptionApi';

const WEB_APP_URL = 'https://vocairo.com';

interface PlanFeature {
  label: string;
  free: boolean;
  pro: boolean;
}

const FEATURES: PlanFeature[] = [
  { label: 'Full dictionary access', free: true, pro: true },
  { label: '3 training sessions/day', free: true, pro: false },
  { label: 'Unlimited training sessions', free: false, pro: true },
  { label: '6 core exercise types', free: true, pro: false },
  { label: 'All 20 exercise types', free: false, pro: true },
  { label: 'Grammar: A1–B1 levels', free: true, pro: false },
  { label: 'Grammar: A1–C2 levels', free: false, pro: true },
  { label: '5 AI tutor messages/day', free: true, pro: false },
  { label: 'Unlimited AI tutor messages', free: false, pro: true },
  { label: 'Basic analytics', free: true, pro: false },
  { label: 'Detailed analytics', free: false, pro: true },
  { label: 'Priority content', free: false, pro: true },
];

function FeatureRow({
  feature,
  isDark,
}: {
  feature: PlanFeature;
  isDark: boolean;
}) {
  const included = feature.pro;
  return (
    <View className="flex-row items-center gap-3 py-2.5">
      {included ? (
        <Check size={16} color="#10B981" />
      ) : (
        <Minus size={16} color={isDark ? '#3F3F46' : '#D4D4D8'} />
      )}
      <Text
        className={`text-sm flex-1 ${included ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        {feature.label}
      </Text>
    </View>
  );
}

export default function PricingScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data, isLoading } = useGetSubscriptionQuery();
  const isActive = data?.subscription?.status === 'active';
  const isCanceled = data?.subscription?.status === 'canceled';
  const periodEnd = data?.subscription?.current_period_end
    ? new Date(data.subscription.current_period_end).toLocaleDateString(
        'en-US',
        { month: 'long', day: 'numeric', year: 'numeric' }
      )
    : null;

  const handleUpgrade = useCallback(() => {
    Linking.openURL(`${WEB_APP_URL}/pricing`);
  }, []);

  const handleManage = useCallback(() => {
    Linking.openURL(`${WEB_APP_URL}/profile`);
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16 }}
    >
      {isActive && (
        <View
          className="rounded-xl p-4 mb-4 flex-row items-center gap-3"
          style={{
            backgroundColor: isDark ? '#064E3B' : '#D1FAE5',
            borderWidth: 1,
            borderColor: isDark ? '#10B981' : '#6EE7B7',
          }}
        >
          <Crown size={20} color="#10B981" />
          <View className="flex-1">
            <Text
              className="text-sm font-semibold"
              style={{ color: isDark ? '#6EE7B7' : '#065F46' }}
            >
              Pro Plan Active
            </Text>
            {isCanceled && periodEnd && (
              <Text
                className="text-xs mt-0.5"
                style={{ color: isDark ? '#6EE7B780' : '#065F4680' }}
              >
                Cancels on {periodEnd}
              </Text>
            )}
            {!isCanceled && periodEnd && (
              <Text
                className="text-xs mt-0.5"
                style={{ color: isDark ? '#6EE7B780' : '#065F4680' }}
              >
                Renews on {periodEnd}
              </Text>
            )}
          </View>
        </View>
      )}

      <View
        className="rounded-xl p-5 mb-4"
        style={{
          backgroundColor: isDark ? '#111113' : '#FFFFFF',
          borderWidth: 1,
          borderColor: isDark ? '#27272A' : '#E7E5E4',
        }}
      >
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-lg font-bold text-foreground">Free</Text>
        </View>
        <Text className="text-3xl font-bold text-foreground">$0</Text>
        <Text className="text-xs text-muted-foreground mt-1">Forever free</Text>

        <View className="mt-4 pt-4 border-t border-border">
          {FEATURES.filter(f => f.free).map(f => (
            <View key={f.label} className="flex-row items-center gap-3 py-2">
              <Check size={16} color="#10B981" />
              <Text className="text-sm text-foreground">{f.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View
        className="rounded-xl p-5 mb-4"
        style={{
          backgroundColor: isDark ? '#111113' : '#FFFFFF',
          borderWidth: 2,
          borderColor: '#10B981',
        }}
      >
        <View className="flex-row items-center gap-2 mb-1">
          <Sparkles size={18} color="#10B981" />
          <Text className="text-lg font-bold text-foreground">Pro</Text>
          <View
            className="px-2 py-0.5 rounded-full ml-auto"
            style={{ backgroundColor: '#10B98120' }}
          >
            <Text
              className="text-[10px] font-semibold"
              style={{ color: '#10B981' }}
            >
              POPULAR
            </Text>
          </View>
        </View>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-3xl font-bold text-foreground">$5</Text>
          <Text className="text-sm text-muted-foreground">/month</Text>
        </View>
        <Text className="text-xs text-muted-foreground mt-1">
          $59.99 billed annually (save 37%)
        </Text>

        <View className="mt-4 pt-4 border-t border-border">
          {FEATURES.filter(f => f.pro).map(f => (
            <View key={f.label} className="flex-row items-center gap-3 py-2">
              <Check size={16} color="#10B981" />
              <Text className="text-sm text-foreground">{f.label}</Text>
            </View>
          ))}
        </View>

        {!isActive && (
          <Pressable
            className="mt-4 bg-primary rounded-xl py-3.5 flex-row items-center justify-center gap-2 active:opacity-80"
            onPress={handleUpgrade}
          >
            <Zap size={18} color="#FFFFFF" />
            <Text className="text-white font-semibold text-base">
              Upgrade to Pro
            </Text>
            <ExternalLink size={14} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      {!isActive && (
        <Text className="text-xs text-muted-foreground text-center mb-4">
          {"You'll be redirected to our website to complete your purchase"}
        </Text>
      )}

      {isActive && (
        <Pressable
          className="rounded-xl py-3.5 flex-row items-center justify-center gap-2 active:opacity-80"
          style={{
            backgroundColor: isDark ? '#1A1A2E' : '#F3F4F6',
          }}
          onPress={handleManage}
        >
          <Text className="text-sm font-medium text-foreground">
            Manage Subscription
          </Text>
          <ExternalLink size={14} color={isDark ? '#FAFAF9' : '#111827'} />
        </Pressable>
      )}

      <View className="mt-6">
        <Text className="text-base font-semibold text-foreground mb-3">
          Pro Features
        </Text>
        <View
          className="rounded-xl p-4"
          style={{
            backgroundColor: isDark ? '#111113' : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDark ? '#27272A' : '#E7E5E4',
          }}
        >
          {FEATURES.map(f => (
            <FeatureRow key={f.label} feature={f} isDark={isDark} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
