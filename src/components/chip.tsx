import { StyleSheet } from 'react-native';

import { AppText } from '@/components/app-text';
import { PressableScale, type PressableScaleProps } from '@/components/pressable-scale';
import { Palette, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ChipProps = Omit<PressableScaleProps, 'children'> & {
  label: string;
  emoji?: string;
  selected?: boolean;
  size?: 'sm' | 'md';
};

/** A selectable pill. Selected chips take the accent. */
export function Chip({ label, emoji, selected, size = 'md', style, ...rest }: ChipProps) {
  const { accent } = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      feedback="select"
      scaleTo={0.94}
      style={[
        styles.chip,
        size === 'sm' ? styles.sm : styles.md,
        selected
          ? { backgroundColor: accent.soft, borderColor: accent.solid }
          : { backgroundColor: Palette.bgElement, borderColor: Palette.border },
        style,
      ]}
      {...rest}
    >
      {emoji ? <AppText variant={size === 'sm' ? 'small' : 'body'}>{emoji}</AppText> : null}
      <AppText variant={size === 'sm' ? 'smallBold' : 'bodyBold'} color={selected ? accent.solid : Palette.textSecondary}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  md: { paddingHorizontal: Spacing.lg, height: 38 },
  sm: { paddingHorizontal: Spacing.md, height: 30 },
});
