import type { GoalIntensity } from "./api/onboardingApi";

export const NATIVE_LANGUAGES = [
  { code: "uk", label: "Ukrainian", flag: "\u{1F1FA}\u{1F1E6}" },
  { code: "es", label: "Spanish", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "de", label: "German", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "fr", label: "French", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "pt", label: "Portuguese", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "pl", label: "Polish", flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "ja", label: "Japanese", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "ko", label: "Korean", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "zh", label: "Chinese", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "ar", label: "Arabic", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "tr", label: "Turkish", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "it", label: "Italian", flag: "\u{1F1EE}\u{1F1F9}" },
];

export interface GoalOption {
  value: GoalIntensity;
  labelKey: string;
  timeKey: string;
  descKey: string;
  color: string;
  bg: string;
}

export const GOAL_OPTIONS: GoalOption[] = [
  {
    value: "casual",
    labelKey: "onboarding.casual",
    timeKey: "onboarding.casualTime",
    descKey: "onboarding.casualDesc",
    color: "#6ee7b7",
    bg: "rgba(110,231,183,0.08)",
  },
  {
    value: "regular",
    labelKey: "onboarding.regular",
    timeKey: "onboarding.regularTime",
    descKey: "onboarding.regularDesc",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.08)",
  },
  {
    value: "intensive",
    labelKey: "onboarding.intensive",
    timeKey: "onboarding.intensiveTime",
    descKey: "onboarding.intensiveDesc",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
];

export const STEPS = ["welcome", "assessment", "goal", "ready"] as const;
export type Step = (typeof STEPS)[number];
