import { useEffect, useRef } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Palette, Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clamp } from '@/utils/format';
import { haptic } from '@/utils/haptics';

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  onComplete?: (value: number) => void;
  accessibilityLabel?: string;
}

const TRACK = 6;
const THUMB = 26;

/** A horizontal slider on the responder system; the fill takes the accent. */
export function Slider({ value, min = 0, max = 1, step, onChange, onComplete, accessibilityLabel }: SliderProps) {
  const { accent } = useTheme();
  const width = useSharedValue(0);
  const progress = useSharedValue(ratioOf(value, min, max));
  // Where the finger landed, so moves can be measured as a delta.
  const grant = useRef({ x0: 0, pageX0: 0, width: 0 });

  useEffect(() => {
    progress.set(withTiming(ratioOf(value, min, max), { duration: 120 }));
  }, [value, min, max, progress]);

  const valueAt = (x: number, w: number) => {
    if (w <= 0) return value;
    let next = min + clamp(x / w, 0, 1) * (max - min);
    if (step) next = Math.round(next / step) * step;
    return clamp(next, min, max);
  };

  const move = (x: number) => {
    const next = valueAt(x, grant.current.width);
    progress.set(ratioOf(next, min, max));
    if (next !== value) {
      haptic.select();
      onChange(next);
    }
  };

  const onGrant = (e: GestureResponderEvent) => {
    grant.current = { x0: e.nativeEvent.locationX, pageX0: e.nativeEvent.pageX, width: width.get() };
    move(e.nativeEvent.locationX);
  };

  const onMove = (e: GestureResponderEvent) => {
    move(grant.current.x0 + (e.nativeEvent.pageX - grant.current.pageX0));
  };

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * Math.max(0, width.get() - THUMB) }],
  }));

  return (
    <View
      style={styles.hit}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      onLayout={(e) => width.set(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={onGrant}
      onResponderMove={onMove}
      onResponderRelease={() => onComplete?.(value)}
      onResponderTerminate={() => onComplete?.(value)}
    >
      <View style={styles.track} pointerEvents="none">
        <Animated.View style={[styles.fill, { backgroundColor: accent.solid }, fillStyle]} />
      </View>
      <Animated.View style={[styles.thumb, { shadowColor: accent.solid }, thumbStyle]} pointerEvents="none">
        <View style={[styles.thumbDot, { backgroundColor: accent.solid }]} />
      </Animated.View>
    </View>
  );
}

function ratioOf(v: number, min: number, max: number) {
  return max === min ? 0 : clamp((v - min) / (max - min), 0, 1);
}

const styles = StyleSheet.create({
  hit: { height: 40, justifyContent: 'center' },
  track: { height: TRACK, borderRadius: Radii.pill, backgroundColor: Palette.bgSelected, overflow: 'hidden' },
  fill: { height: TRACK, borderRadius: Radii.pill },
  thumb: {
    position: 'absolute',
    left: 0,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  thumbDot: { width: 10, height: 10, borderRadius: 5 },
});
