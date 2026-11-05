/**
 * The single place for shared visual values.
 * Pages and components read from here; nothing else carries a literal colour, size or radius.
 * One main colour: `Palette.accent`. Everything that needs emphasis uses it.
 */

export const Palette = {
  bg: '#0B0B10',
  bgElevated: '#15151C',
  bgElement: '#1E1E27',
  bgSelected: '#2A2A36',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.18)',
  text: '#FFFFFF',
  textSecondary: '#A9ABB8',
  textMuted: '#6E7183',
  /** The one main colour. */
  accent: '#FF2D55',
  accentSoft: 'rgba(255,45,85,0.14)',
  accentTint: '#FF7A96',
  live: '#FF2D55',
  danger: '#FF2D55',
  verified: '#20B8F5',
  overlay: 'rgba(0,0,0,0.6)',
  /** Dark backing for pills drawn over the camera. */
  scrim: 'rgba(0,0,0,0.45)',
  scrimLight: 'rgba(0,0,0,0.3)',
  glass: 'rgba(255,255,255,0.12)',
  glassStrong: 'rgba(255,255,255,0.2)',
  /** Text drawn over the camera. */
  onMedia: '#FFFFFF',
  onMediaSecondary: 'rgba(255,255,255,0.78)',
  onMediaMuted: 'rgba(255,255,255,0.6)',
  scrimTop: ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)'] as [string, string],
  scrimBottom: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)'] as [string, string],
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Accent = {
  solid: Palette.accent,
  soft: Palette.accentSoft,
  tint: Palette.accentTint,
  glow: 'rgba(255,45,85,0.45)',
} as const;

/** Spacing scale in points. */
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 64,
} as const;

export const Radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const Fonts = {
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
} as const;

export const Type = {
  display: { fontSize: 40, lineHeight: 44, fontFamily: Fonts.black, letterSpacing: -1.2 },
  h1: { fontSize: 28, lineHeight: 34, fontFamily: Fonts.extraBold, letterSpacing: -0.6 },
  h2: { fontSize: 22, lineHeight: 28, fontFamily: Fonts.bold, letterSpacing: -0.3 },
  h3: { fontSize: 17, lineHeight: 22, fontFamily: Fonts.semiBold },
  body: { fontSize: 15, lineHeight: 21, fontFamily: Fonts.medium },
  bodyBold: { fontSize: 15, lineHeight: 21, fontFamily: Fonts.bold },
  small: { fontSize: 13, lineHeight: 18, fontFamily: Fonts.medium },
  smallBold: { fontSize: 13, lineHeight: 18, fontFamily: Fonts.bold },
  tiny: { fontSize: 11, lineHeight: 14, fontFamily: Fonts.semiBold, letterSpacing: 0.4 },
  stat: { fontSize: 20, lineHeight: 24, fontFamily: Fonts.extraBold, letterSpacing: -0.4 },
} as const;

export type TypeVariant = keyof typeof Type;

/** Animation durations in ms. */
export const Motion = {
  fast: 160,
  normal: 260,
  slow: 420,
} as const;

export const Sizes = {
  touch: 44,
  touchSm: 36,
  /** Round controls on the live screen. */
  control: 40,
  controlSm: 32,
  avatarXs: 20,
  avatarSm: 28,
  avatarMd: 40,
  avatarLg: 72,
  avatarXl: 104,
  icon: 22,
  iconSm: 16,
  iconLg: 28,
  verified: 16,
  verifiedSm: 12,
  verifiedLg: 18,
} as const;
