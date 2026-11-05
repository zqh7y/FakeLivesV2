import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { Palette, Radii, Spacing } from '@/constants/theme';

/** The red LIVE pill with a breathing dot. */
export function LiveBadge({ compact, color = Palette.live }: { compact?: boolean; color?: string }) {
  const reduce = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduce) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 650, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 650, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [pulse, reduce]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.8 + pulse.value * 0.3 }],
  }));

  return (
    <View style={[styles.pill, compact ? styles.compact : null, { backgroundColor: color }]}>
      <Animated.View style={[styles.dot, dotStyle]} />
      <AppText variant="tiny" color="white">
        LIVE
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    height: 24,
    borderRadius: Radii.xs,
  },
  compact: { height: 20, paddingHorizontal: Spacing.xs + 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Palette.white },
});
