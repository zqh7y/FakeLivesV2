import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import type { IconName } from '@/components/button';
import { PressableScale, type PressableScaleProps } from '@/components/pressable-scale';
import { Palette, Radii, Sizes } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type IconButtonProps = Omit<PressableScaleProps, 'children'> & {
  icon: IconName;
  label: string;
  size?: number;
  iconSize?: number;
  variant?: 'glass' | 'elevated' | 'accent' | 'plain' | 'danger';
  color?: string;
};

/** A round icon-only button. Glass is for over the camera; elevated for regular screens. */
export function IconButton({
  icon,
  label,
  size = Sizes.touch,
  iconSize = Sizes.icon,
  variant = 'elevated',
  color,
  style,
  ...rest
}: IconButtonProps) {
  const { accent } = useTheme();
  const bg =
    variant === 'glass'
      ? Palette.glass
      : variant === 'elevated'
        ? Palette.bgElement
        : variant === 'accent'
          ? accent.solid
          : variant === 'danger'
            ? Palette.danger
            : 'transparent';

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      scaleTo={0.9}
      hitSlop={6}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: Radii.pill, backgroundColor: bg },
        variant === 'glass' ? styles.glassBorder : null,
        style,
      ]}
      {...rest}
    >
      <Ionicons name={icon} size={iconSize} color={color ?? Palette.white} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  glassBorder: { borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.borderStrong },
});
