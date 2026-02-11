export const colors = {
  primary: {
    light: '#3B82F6',
    dark: '#2563EB',
    hover: '#1D4ED8',
  },

  secondary: {
    light: '#6B7280',
    dark: '#9CA3AF',
  },

  text: {
    primary: {
      light: '#111827',
      dark: '#FFFFFF',
    },
    secondary: {
      light: '#4B5563',
      dark: '#D1D5DB',
    },
    muted: {
      light: '#6B7280',
      dark: '#9CA3AF',
    },
  },

  background: {
    primary: {
      light: '#FFFFFF',
      dark: '#1F2937',
    },
    secondary: {
      light: '#F9FAFB',
      dark: '#374151',
    },
    card: {
      light: '#FFFFFF',
      dark: '#374151',
    },
    page: {
      light: '#F8FAFC',
      dark: '#0F172A',
    },
  },

  border: {
    light: '#E5E7EB',
    dark: '#374151',
  },

  features: {
    analysis: {
      icon: {
        light: '#DBEAFE',
        dark: '#1E3A8A',
      },
      text: {
        light: '#2563EB',
        dark: '#60A5FA',
      },
    },
    training: {
      icon: {
        light: '#D1FAE5',
        dark: '#065F46',
      },
      text: {
        light: '#059669',
        dark: '#34D399',
      },
    },
    progress: {
      icon: {
        light: '#F3E8FF',
        dark: '#581C87',
      },
      text: {
        light: '#7C3AED',
        dark: '#A78BFA',
      },
    },
  },

  button: {
    primary: {
      background: '#3B82F6',
      hover: '#2563EB',
      text: '#FFFFFF',
    },
    secondary: {
      background: 'transparent',
      border: '#3B82F6',
      text: {
        light: '#2563EB',
        dark: '#60A5FA',
      },
      hover: {
        light: '#EFF6FF',
        dark: '#1E3A8A',
      },
    },
  },

  statusFilters: {
    all: {
      border: '#9CA3AF',
      text: '#FFFFFF',
      bg: 'rgba(255, 255, 255, 0.1)',
      activeBg: 'rgba(255, 255, 255, 0.2)',
      hover: 'rgba(255, 255, 255, 0.2)',
      accent: '#9CA3AF',
    },
    notLearned: {
      border: '#FF6B6B',
      text: '#FF6B6B',
      bg: 'rgba(255, 107, 107, 0.1)',
      activeBg: 'rgba(255, 107, 107, 0.2)',
      hover: 'rgba(255, 107, 107, 0.2)',
      accent: '#FF6B6B',
    },
    beginner: {
      border: '#FFB347',
      text: '#FFB347',
      bg: 'rgba(255, 179, 71, 0.1)',
      activeBg: 'rgba(255, 179, 71, 0.2)',
      hover: 'rgba(255, 179, 71, 0.2)',
      accent: '#FFB347',
    },
    basic: {
      border: '#FFD600',
      text: '#FFD600',
      bg: 'rgba(255, 214, 0, 0.1)',
      activeBg: 'rgba(255, 214, 0, 0.2)',
      hover: 'rgba(255, 214, 0, 0.2)',
      accent: '#FFD600',
    },
    intermediate: {
      border: '#64B5F6',
      text: '#64B5F6',
      bg: 'rgba(100, 181, 246, 0.1)',
      activeBg: 'rgba(100, 181, 246, 0.2)',
      hover: 'rgba(100, 181, 246, 0.2)',
      accent: '#64B5F6',
    },
    advanced: {
      border: '#43E97B',
      text: '#43E97B',
      bg: 'rgba(67, 233, 123, 0.1)',
      activeBg: 'rgba(67, 233, 123, 0.2)',
      hover: 'rgba(67, 233, 123, 0.2)',
      accent: '#43E97B',
    },
    wellKnown: {
      border: '#B388FF',
      text: '#B388FF',
      bg: 'rgba(179, 136, 255, 0.1)',
      activeBg: 'rgba(179, 136, 255, 0.2)',
      hover: 'rgba(179, 136, 255, 0.2)',
      accent: '#B388FF',
    },
    mastered: {
      border: '#18FFFF',
      text: '#18FFFF',
      bg: 'rgba(24, 255, 255, 0.1)',
      activeBg: 'rgba(24, 255, 255, 0.2)',
      hover: 'rgba(24, 255, 255, 0.2)',
      accent: '#18FFFF',
    },
  },

  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

export const getThemeColors = (isDark: boolean) => ({
  primary: isDark ? colors.primary.dark : colors.primary.light,
  background: isDark
    ? colors.background.primary.dark
    : colors.background.primary.light,
  text: isDark ? colors.text.primary.dark : colors.text.primary.light,
  textSecondary: isDark
    ? colors.text.secondary.dark
    : colors.text.secondary.light,
  border: isDark ? colors.border.dark : colors.border.light,
  card: isDark ? colors.background.card.dark : colors.background.card.light,
});

export type ThemeColors = ReturnType<typeof getThemeColors>;
