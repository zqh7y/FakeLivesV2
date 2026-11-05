import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/app-text';
import { Palette, Radii, Spacing } from '@/constants/theme';

export interface StatTileProps {
  value: string;
  label: string;
  emoji?: string;
  tone?: 'default' | 'accent';
  style?: StyleProp<ViewStyle>;
}

/** A number with a label underneath, for stat rows and the summary grid. */
export function StatTile({ value, label, emoji, tone = 'default', style }: StatTileProps) {
  return (
    <View style={[styles.tile, style]}>
      {emoji ? <AppText variant="h3">{emoji}</AppText> : null}
      <AppText variant="stat" color={tone === 'accent' ? 'accent' : 'text'} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </AppText>
      <AppText variant="tiny" color="textMuted" style={styles.label}>
        {label.toUpperCase()}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 96,
    gap: Spacing.xxs,
    padding: Spacing.lg,
    borderRadius: Radii.md,
    backgroundColor: Palette.bgElement,
  },
  label: { marginTop: Spacing.xxs },
});
