import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/app-text';
import { Fonts, Palette, Radii, Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextFieldProps = TextInputProps & {
  label?: string;
  prefix?: string;
  suffix?: string;
  helper?: string;
  error?: string;
  right?: React.ReactNode;
};

/** A labelled input on the dark surface. The border takes the accent while focused. */
export function TextField({ label, prefix, suffix, helper, error, right, style, multiline, onFocus, onBlur, ...rest }: TextFieldProps) {
  const { accent } = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? Palette.danger : focused ? accent.solid : Palette.border;

  return (
    <View style={styles.wrap}>
      {label ? (
        <AppText variant="smallBold" color="textSecondary" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={[styles.box, { borderColor }, multiline ? styles.multiline : null]}>
        {prefix ? (
          <AppText variant="body" color="textMuted">
            {prefix}
          </AppText>
        ) : null}
        <TextInput
          {...rest}
          multiline={multiline}
          style={[styles.input, multiline ? styles.inputMultiline : null, style]}
          placeholderTextColor={Palette.textMuted}
          selectionColor={accent.solid}
          cursorColor={accent.solid}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {suffix ? (
          <AppText variant="small" color="textMuted">
            {suffix}
          </AppText>
        ) : null}
        {right}
      </View>
      {error || helper ? (
        <AppText variant="small" color={error ? 'danger' : 'textMuted'} style={styles.helper}>
          {error ?? helper}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.xs },
  label: { paddingHorizontal: Spacing.xxs },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 50,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
    backgroundColor: Palette.bgElement,
  },
  multiline: { alignItems: 'flex-start', paddingVertical: Spacing.md },
  input: {
    flex: 1,
    color: Palette.text,
    fontFamily: Fonts.medium,
    fontSize: Type.body.fontSize,
    paddingVertical: Spacing.md,
    minWidth: 0,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top', paddingVertical: 0 },
  helper: { paddingHorizontal: Spacing.xxs },
});
