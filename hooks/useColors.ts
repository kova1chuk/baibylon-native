import { useColorScheme } from 'nativewind';

import { Colors } from '@/constants/Colors';

/**
 * Returns the full set of theme-aware hex colors from Colors.ts.
 * Use this for icon `color` props, Switch trackColor, and other
 * places where Tailwind classes can't be applied.
 *
 * For View/Text styling, prefer Tailwind classes:
 *   className="bg-card text-foreground border-border"
 */
export function useColors() {
  const { colorScheme } = useColorScheme();
  return Colors[colorScheme ?? 'light'];
}
