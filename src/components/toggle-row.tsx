import { Platform, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Palette, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { haptic } from '@/utils/haptics';

export interface ToggleRowProps {
  label: string;
  description?: string;
  emoji?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  last?: boolean;
}

/** A labelled on/off row inside a Card. */
export function ToggleRow({ label, description, emoji, value, onValueChange, last }: ToggleRowProps) {
  const { accent } = useTheme();
  return (
    <View style={[styles.row, last ? null : styles.divider]}>
      {emoji ? <AppText variant="h3">{emoji}</AppText> : null}
      <View style={styles.text}>
        <AppText variant="bodyBold">{label}</AppText>
        {description ? (
          <AppText variant="small" color="textSecondary">
            {description}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          haptic.select();
          onValueChange(v);
        }}
        trackColor={{ false: Palette.bgSelected, true: accent.solid }}
        thumbColor={Platform.OS === 'android' ? Palette.white : undefined}
        ios_backgroundColor={Palette.bgSelected}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  text: { flex: 1, gap: Spacing.xxs },
});
