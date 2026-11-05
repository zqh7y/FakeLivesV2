import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { PressableScale } from '@/components/pressable-scale';
import { PlatformOrder, Platforms } from '@/constants/platforms';
import { Palette, Radii, Sizes, Spacing } from '@/constants/theme';
import type { PlatformKey } from '@/types';

export interface PlatformPickerProps {
  value: PlatformKey;
  onChange: (key: PlatformKey) => void;
}

/** One round button per platform look; the chosen one fills with that platform's colour. */
export function PlatformPicker({ value, onChange }: PlatformPickerProps) {
  return (
    <View style={styles.row}>
      {PlatformOrder.map((key) => {
        const p = Platforms[key];
        const selected = key === value;
        return (
          <PressableScale
            key={key}
            feedback="select"
            scaleTo={0.9}
            onPress={() => onChange(key)}
            accessibilityRole="button"
            accessibilityLabel={`${p.name} look`}
            accessibilityState={{ selected }}
            style={styles.item}
          >
            <View style={[styles.circle, { backgroundColor: selected ? p.color : Palette.bgElement }]}>
              <Ionicons name={p.icon} size={Sizes.icon} color={selected ? Palette.white : Palette.textSecondary} />
            </View>
            <AppText variant="tiny" color={selected ? 'text' : 'textMuted'}>
              {p.name}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  item: { alignItems: 'center', gap: Spacing.xs, flex: 1 },
  circle: { width: 52, height: 52, borderRadius: Radii.pill, alignItems: 'center', justifyContent: 'center' },
});
