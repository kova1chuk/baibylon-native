import React, { useEffect } from "react";

import { useRouter, useSegments } from "expo-router";

import { useGetOnboardingStatusQuery } from "../api/onboardingApi";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const { data, isLoading } = useGetOnboardingStatusQuery();
  const isOnboardingRoute = segments.includes("onboarding" as never);

  useEffect(() => {
    if (isLoading || !data) return;

    if (!isOnboardingRoute && data.completedAt === null) {
      router.replace("/onboarding");
    }

    if (isOnboardingRoute && data.completedAt !== null) {
      router.replace("/(tabs)");
    }
  }, [isLoading, data, isOnboardingRoute, router]);

  return <>{children}</>;
}
