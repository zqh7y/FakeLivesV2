import { StyleSheet, Text, type TextProps } from 'react-native';

import { Palette, Type, type TypeVariant } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PaletteColor = {
  [K in keyof typeof Palette]: (typeof Palette)[K] extends string ? K : never;
}[keyof typeof Palette];

export type AppTextProps = TextProps & {
  variant?: TypeVariant;
  /** A palette key, `accent`, or any colour string. */
  color?: PaletteColor | 'accent' | (string & {});
  align?: 'left' | 'center' | 'right';
};

/** Every piece of text in the app goes through here so type and colour stay consistent. */
export function AppText({ variant = 'body', color = 'text', align, style, ...rest }: AppTextProps) {
  const { accent } = useTheme();
  const resolved =
    color === 'accent'
      ? accent.solid
      : color in Palette
        ? (Palette[color as PaletteColor] as string)
        : color;

  return (
    <Text
      {...rest}
      style={[Type[variant], styles.base, { color: resolved }, align ? { textAlign: align } : null, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
