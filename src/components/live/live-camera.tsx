import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Accent, Palette, Spacing } from '@/constants/theme';
import type { FilterKey } from '@/types';

export interface LiveCameraProps {
  facing: 'front' | 'back';
  mirror: boolean;
  filter: FilterKey;
}

const FILTERS: Record<FilterKey, { colors: [string, string]; opacity: number }> = {
  none: { colors: ['transparent', 'transparent'], opacity: 0 },
  warm: { colors: ['rgba(255,170,60,1)', 'rgba(255,90,60,1)'], opacity: 0.16 },
  cool: { colors: ['rgba(80,160,255,1)', 'rgba(120,80,255,1)'], opacity: 0.16 },
  rose: { colors: ['rgba(255,90,170,1)', 'rgba(255,150,200,1)'], opacity: 0.16 },
  dusk: { colors: ['rgba(255,120,60,1)', 'rgba(90,40,160,1)'], opacity: 0.2 },
  noir: { colors: ['rgba(0,0,0,1)', 'rgba(0,0,0,1)'], opacity: 0.32 },
};

export const FilterOrder: FilterKey[] = ['none', 'warm', 'cool', 'rose', 'dusk', 'noir'];
export const FilterNames: Record<FilterKey, string> = { none: 'No filter', warm: 'Warm', cool: 'Cool', rose: 'Rose', dusk: 'Dusk', noir: 'Noir' };

/** The camera preview, or a moving gradient when there is no camera, plus the colour filter. */
export function LiveCamera({ facing, mirror, filter }: LiveCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission().catch(() => undefined);
    }
  }, [permission, requestPermission]);

  const ready = !!permission?.granted && !failed;
  const f = FILTERS[filter];

  return (
    <View style={StyleSheet.absoluteFill}>
      {ready ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing={facing}
          mirror={facing === 'front' ? mirror : false}
          onMountError={() => setFailed(true)}
        />
      ) : (
        <Placeholder canAsk={!!permission?.canAskAgain && !permission.granted} onAsk={() => requestPermission().catch(() => undefined)} />
      )}
      {f.opacity > 0 ? (
        <LinearGradient
          colors={f.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity: f.opacity }]}
          pointerEvents="none"
        />
      ) : null}
    </View>
  );
}

function Placeholder({ canAsk, onAsk }: { canAsk: boolean; onAsk: () => void }) {
  const reduce = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduce) return;
    t.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [t, reduce]);

  const blobA = useAnimatedStyle(() => ({
    transform: [{ translateX: t.value * 80 - 40 }, { translateY: t.value * 120 - 60 }, { scale: 1 + t.value * 0.3 }],
  }));
  const blobB = useAnimatedStyle(() => ({
    transform: [{ translateX: 40 - t.value * 100 }, { translateY: 80 - t.value * 140 }, { scale: 1.3 - t.value * 0.3 }],
  }));

  return (
    <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
      <Animated.View style={[styles.blob, styles.blobA, blobA]} />
      <Animated.View style={[styles.blob, styles.blobB, blobB]} />
      <View style={styles.placeholderText}>
        <Ionicons name="videocam-off-outline" size={36} color={Palette.onMediaSecondary} />
        <AppText variant="small" color="onMediaSecondary" align="center">
          Camera preview unavailable
        </AppText>
        {canAsk ? <Button title="Allow camera" variant="glass" size="sm" onPress={onAsk} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: Palette.bgElevated, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  blob: { position: 'absolute', width: 360, height: 360, borderRadius: 180 },
  blobA: { top: '10%', left: '-20%', backgroundColor: Accent.solid, opacity: 0.22 },
  blobB: { bottom: '8%', right: '-25%', backgroundColor: Palette.bgSelected, opacity: 0.9 },
  placeholderText: { alignItems: 'center', gap: Spacing.md, padding: Spacing.xl },
});
