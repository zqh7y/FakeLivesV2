import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Palette, Radii, Spacing } from '@/constants/theme';
import type { ChatEvent } from '@/types';

export interface ToastStackProps {
  /** Toasts waiting; the first two are on screen. */
  queue: ChatEvent[];
  /** Called when the first toast has been shown long enough. */
  onDone: (id: string) => void;
  /** Icon tint; the platform colour on the live screen. */
  color: string;
  style?: StyleProp<ViewStyle>;
}

const SHOW_MS = 2600;

/** Small glass toasts under the top bar for follows and shares. */
export function ToastStack({ queue, onDone, color, style }: ToastStackProps) {
  const headId = queue[0]?.id;

  useEffect(() => {
    if (!headId) return;
    const t = setTimeout(() => onDone(headId), SHOW_MS);
    return () => clearTimeout(t);
    // The timer belongs to the toast at the head of the queue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headId]);

  const visible = queue.slice(0, 2);
  if (visible.length === 0) return null;

  return (
    <View style={[styles.layer, style]} pointerEvents="none">
      {visible.map((event) => (
        <Animated.View
          key={event.id}
          entering={FadeInDown.duration(260)}
          exiting={FadeOutUp.duration(200)}
          layout={LinearTransition.duration(180)}
          style={styles.toast}
        >
          <Avatar generated={event.user.avatar} name={event.user.name} size={24} />
          <AppText variant="small" color="white" numberOfLines={1} style={styles.text}>
            {event.text}
          </AppText>
          <Ionicons name={event.kind === 'share' ? 'arrow-redo' : 'heart'} size={14} color={color} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', left: Spacing.lg, right: Spacing.lg, gap: Spacing.xs, alignItems: 'flex-start' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    maxWidth: '80%',
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.pill,
    backgroundColor: Palette.overlay,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.borderStrong,
  },
  text: { flexShrink: 1 },
});
