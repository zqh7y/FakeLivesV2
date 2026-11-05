import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { Palette, Spacing } from '@/constants/theme';

export interface ScreenProps {
  children: ReactNode;
  /** Scrolls its content and avoids the keyboard. */
  scroll?: boolean;
  /** Horizontal page gutter. */
  padded?: boolean;
  edges?: Edge[];
  header?: ReactNode;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

/** The page holder: dark background, safe-area insets, optional scroll, optional sticky footer. */
export function Screen({
  children,
  scroll,
  padded = true,
  edges = ['top', 'left', 'right', 'bottom'],
  header,
  footer,
  contentStyle,
  style,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const pad = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };
  const bottom = edges.includes('bottom') ? Math.max(insets.bottom, Spacing.lg) : 0;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        padded ? styles.gutter : null,
        { paddingBottom: footer ? Spacing.lg : bottom + Spacing.lg },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padded ? styles.gutter : null, footer ? null : { paddingBottom: bottom }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.root, pad, style]}>
      {header}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {body}
        {footer ? (
          <View style={[styles.footer, padded ? styles.gutter : null, { paddingBottom: bottom }]}>
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.bg },
  flex: { flex: 1 },
  gutter: { paddingHorizontal: Spacing.lg },
  footer: {
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    backgroundColor: Palette.bg,
  },
});
