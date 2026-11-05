import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Palette, Radii, Spacing } from '@/constants/theme';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
  accessibilityLabel?: string;
}

/** A raised group on the dark background; tappable when `onPress` is given. */
export function Card({ children, style, onPress, padded = true, accessibilityLabel }: CardProps) {
  const base = [styles.card, padded ? styles.padded : null, style];
  if (onPress) {
    return (
      <PressableScale
        scaleTo={0.985}
        onPress={onPress}
        style={base}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </PressableScale>
    );
  }
  return <View style={base}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.bgElevated,
    borderRadius: Radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  padded: { padding: Spacing.lg },
});
