export const colors = {
  // Primary colors
  primary: {
    light: '#3B82F6', // blue-500
    dark: '#2563EB', // blue-600
    hover: '#1D4ED8', // blue-700
  },

  // Secondary colors
  secondary: {
    light: '#6B7280', // gray-500
    dark: '#9CA3AF', // gray-400
  },

  // Text colors
  text: {
    primary: {
      light: '#111827', // gray-900
      dark: '#FFFFFF', // white
    },
    secondary: {
      light: '#4B5563', // gray-600
      dark: '#D1D5DB', // gray-300
    },
    muted: {
      light: '#6B7280', // gray-500
      dark: '#9CA3AF', // gray-400
    },
  },

  // Background colors
  background: {
    primary: {
      light: '#FFFFFF', // white
      dark: '#1F2937', // gray-800
    },
    secondary: {
      light: '#F9FAFB', // gray-50
      dark: '#374151', // gray-700
    },
    card: {
      light: '#FFFFFF', // white
      dark: '#374151', // gray-700
    },
    page: {
      light: '#F8FAFC', // slate-50
      dark: '#0F172A', // slate-900
    },
  },

  // Border colors
  border: {
    light: '#E5E7EB', // gray-200
    dark: '#374151', // gray-700
  },

  // Feature colors
  features: {
    analysis: {
      icon: {
        light: '#DBEAFE', // blue-100
        dark: '#1E3A8A', // blue-900
      },
      text: {
        light: '#2563EB', // blue-600
        dark: '#60A5FA', // blue-400
      },
    },
    training: {
      icon: {
        light: '#D1FAE5', // green-100
        dark: '#065F46', // green-900
      },
      text: {
        light: '#059669', // green-600
        dark: '#34D399', // green-400
      },
    },
    progress: {
      icon: {
        light: '#F3E8FF', // purple-100
        dark: '#581C87', // purple-900
      },
      text: {
        light: '#7C3AED', // purple-600
        dark: '#A78BFA', // purple-400
      },
    },
  },

  // Button colors
  button: {
    primary: {
      background: '#3B82F6', // blue-500
      hover: '#2563EB', // blue-600
      text: '#FFFFFF', // white
    },
    secondary: {
      background: 'transparent',
      border: '#3B82F6', // blue-500
      text: {
        light: '#2563EB', // blue-600
        dark: '#60A5FA', // blue-400
      },
      hover: {
        light: '#EFF6FF', // blue-50
        dark: '#1E3A8A', // blue-900
      },
    },
  },

  // Status filter colors
  statusFilters: {
    all: {
      border: '#9CA3AF', // gray-400
      text: '#FFFFFF', // white
      bg: 'rgba(255, 255, 255, 0.1)',
      activeBg: 'rgba(255, 255, 255, 0.2)',
      hover: 'rgba(255, 255, 255, 0.2)',
      accent: '#9CA3AF', // gray-400
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

  // Success/Error colors
  success: '#10B981', // green-500
  error: '#EF4444', // red-500
  warning: '#F59E0B', // amber-500
  info: '#3B82F6', // blue-500
} as const;

// Helper function to get theme-aware colors
export const getThemeColors = (isDark: boolean) => ({
  primary: isDark ? colors.primary.dark : colors.primary.light,
  background: isDark ? colors.background.primary.dark : colors.background.primary.light,
  text: isDark ? colors.text.primary.dark : colors.text.primary.light,
  textSecondary: isDark
    ? colors.text.secondary.dark
    : colors.text.secondary.light,
  border: isDark ? colors.border.dark : colors.border.light,
  card: isDark ? colors.background.card.dark : colors.background.card.light,
});

export type ThemeColors = ReturnType<typeof getThemeColors>;
