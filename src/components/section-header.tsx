import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { PressableScale } from '@/components/pressable-scale';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Title row above a Card. The optional action is a small accent link on the right. */
export function SectionHeader({ title, subtitle, actionLabel, onAction }: SectionHeaderProps) {
  const { accent } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <AppText variant="h3">{title}</AppText>
        {subtitle ? (
          <AppText variant="small" color="textSecondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <PressableScale onPress={onAction} style={styles.action} accessibilityRole="button">
          <AppText variant="smallBold" color="accent">
            {actionLabel}
          </AppText>
          <Ionicons name="chevron-forward" size={14} color={accent.solid} />
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  titles: { gap: Spacing.xxs, flex: 1 },
  action: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xxs, paddingVertical: Spacing.xs },
});
