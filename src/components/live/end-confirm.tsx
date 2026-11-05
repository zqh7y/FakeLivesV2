import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Palette, Radii, Spacing } from '@/constants/theme';
import { formatCompact, formatDuration } from '@/utils/format';

export interface EndConfirmProps {
  visible: boolean;
  viewers: number;
  elapsedSec: number;
  onEnd: () => void;
  onCancel: () => void;
}

/** "End your LIVE?" with the current numbers, so ending is never an accident. */
export function EndConfirm({ visible, viewers, elapsedSec, onEnd, onCancel }: EndConfirmProps) {
  if (!visible) return null;
  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(160)} style={StyleSheet.absoluteFill}>
        <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onCancel} accessibilityLabel="Keep going" />
      </Animated.View>
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View entering={ZoomIn.duration(220)} exiting={FadeOut.duration(120)} style={styles.card}>
          <AppText variant="h2" align="center">
            End your live?
          </AppText>
          <AppText variant="body" color="textSecondary" align="center">
            {formatCompact(viewers)} people are watching · {formatDuration(elapsedSec)}
          </AppText>
          <View style={styles.actions}>
            <Button title="End now" fullWidth onPress={onEnd} />
            <Button title="Keep going" variant="secondary" fullWidth onPress={onCancel} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: Palette.overlay },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  card: {
    width: '100%',
    maxWidth: 360, // phones are narrower; this only matters on tablets
    gap: Spacing.md,
    padding: Spacing.xl,
    borderRadius: Radii.xl,
    backgroundColor: Palette.bgElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  actions: { gap: Spacing.sm, marginTop: Spacing.sm },
});
