import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { PressableScale, type PressableScaleProps } from '@/components/pressable-scale';
import { Palette, Radii, Sizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type ButtonProps = Omit<PressableScaleProps, 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
};

const heights = { sm: 36, md: Sizes.touch, lg: 56 } as const;

/** The app's button. Primary is the accent; the rest are flat and quiet. */
export function Button({ title, variant = 'primary', size = 'md', icon, iconRight, loading, fullWidth, style, disabled, ...rest }: ButtonProps) {
  const { accent } = useTheme();
  const height = heights[size];
  const textVariant = size === 'lg' ? 'h3' : size === 'sm' ? 'smallBold' : 'bodyBold';
  const iconSize = size === 'lg' ? Sizes.icon : 18;
  const textColor = variant === 'ghost' ? accent.solid : Palette.white;
  const radius = size === 'lg' ? Radii.lg : Radii.md;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      feedback={variant === 'primary' ? 'medium' : 'light'}
      style={[
        styles.base,
        { height, borderRadius: radius },
        fullWidth ? styles.fullWidth : null,
        variant === 'primary' ? { backgroundColor: accent.solid, shadowColor: accent.solid } : null,
        variant === 'primary' ? styles.primaryShadow : null,
        variant === 'secondary' ? styles.secondary : null,
        variant === 'glass' ? styles.glass : null,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={iconSize} color={textColor} /> : null}
          <AppText variant={textVariant} color={textColor}>
            {title}
          </AppText>
          {iconRight ? <Ionicons name={iconRight} size={iconSize} color={textColor} /> : null}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  fullWidth: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  secondary: { backgroundColor: Palette.bgElement },
  glass: { backgroundColor: Palette.glass, borderWidth: 1, borderColor: Palette.borderStrong },
  primaryShadow: {
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
