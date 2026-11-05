import { Accent, Motion, Palette, Radii, Sizes, Spacing, Type } from '@/constants/theme';

const theme = {
  colors: Palette,
  accent: Accent,
  spacing: Spacing,
  radii: Radii,
  type: Type,
  motion: Motion,
  sizes: Sizes,
} as const;

/** Theme values. Kept as a hook so a future light mode or user accent can slot in. */
export function useTheme() {
  return theme;
}

export type Theme = typeof theme;
