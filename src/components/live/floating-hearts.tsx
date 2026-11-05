import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Accent, Palette } from '@/constants/theme';
import { pick, randFloat, uid } from '@/utils/random';

export interface FloatingHeartsHandle {
  spawn: (count?: number, options?: { emoji?: string; big?: boolean }) => void;
}

interface Particle {
  id: string;
  color: string;
  emoji?: string;
  size: number;
  startX: number;
  drift: number;
  rise: number;
  duration: number;
  wobble: number;
}

const MAX_PARTICLES = 36;


/** Hearts (or any emoji) that float up and fade, like a live's like stream. */
export const FloatingHearts = forwardRef<FloatingHeartsHandle, { style?: StyleProp<ViewStyle>; height?: number; color?: string }>(
  function FloatingHearts({ style, height = 420, color = Accent.solid }, ref) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

    useEffect(() => {
      const pending = timers.current;
      return () => {
        for (const t of pending) clearTimeout(t);
        pending.clear();
      };
    }, []);

    const spawn = useCallback(
      (count = 1, options?: { emoji?: string; big?: boolean }) => {
        const batch: Particle[] = [];
        for (let i = 0; i < count; i++) {
          const duration = randFloat(1500, 2500);
          batch.push({
            id: uid('p'),
            color: pick([color, color, color, Palette.white]),
            emoji: options?.emoji,
            size: options?.big ? randFloat(30, 44) : randFloat(18, 30),
            startX: randFloat(0, 36),
            drift: randFloat(-40, 40),
            rise: height * randFloat(0.7, 1),
            duration,
            wobble: randFloat(10, 26),
          });
        }
        setParticles((prev) => [...prev, ...batch].slice(-MAX_PARTICLES));
        const t = setTimeout(() => {
          timers.current.delete(t);
          const ids = new Set(batch.map((p) => p.id));
          setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
        }, 2600);
        timers.current.add(t);
      },
      [height, color],
    );

    useImperativeHandle(ref, () => ({ spawn }), [spawn]);

    return (
      <View style={[styles.layer, { height }, style]} pointerEvents="none">
        {particles.map((p) => (
          <Heart key={p.id} particle={p} />
        ))}
      </View>
    );
  },
);

function Heart({ particle }: { particle: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: particle.duration, easing: Easing.out(Easing.quad) });
  }, [particle.duration, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const scale = p < 0.15 ? 0.5 + (p / 0.15) * 0.7 : 1.2 - (p - 0.15) * 0.3;
    return {
      opacity: p < 0.75 ? 1 : 1 - (p - 0.75) / 0.25,
      transform: [
        { translateY: -p * particle.rise },
        { translateX: particle.drift * p + Math.sin(p * Math.PI * 3) * particle.wobble },
        { scale },
        { rotate: `${Math.sin(p * Math.PI * 2) * 14}deg` },
      ],
    };
  });

  return (
    <Animated.View style={[styles.heart, { left: particle.startX }, style]}>
      {particle.emoji ? (
        <Animated.Text style={{ fontSize: particle.size, lineHeight: particle.size * 1.2 }}>{particle.emoji}</Animated.Text>
      ) : (
        <Ionicons name="heart" size={particle.size} color={particle.color} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: { width: 90, overflow: 'visible' },
  heart: { position: 'absolute', bottom: 0 },
});
