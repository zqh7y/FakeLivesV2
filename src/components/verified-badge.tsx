import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

export interface VerifiedBadgeProps {
  size?: number;
}

/** The blue verified check. */
export function VerifiedBadge({ size = 16 }: VerifiedBadgeProps) {
  return (
    <View
      style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}
      accessibilityLabel="Verified"
    >
      <Ionicons name="checkmark" size={size * 0.68} color={Palette.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { backgroundColor: Palette.verified, alignItems: 'center', justifyContent: 'center' },
});
