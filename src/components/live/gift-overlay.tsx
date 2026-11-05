import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInLeft, FadeOut, ZoomIn } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { FloatingHearts, type FloatingHeartsHandle } from '@/components/live/floating-hearts';
import { moneyEmoji, moneyLabel } from '@/components/live/platforms/shared';
import type { PlatformMeta } from '@/constants/platforms';
import { Palette, Radii, Sizes, Spacing } from '@/constants/theme';
import type { ChatEvent } from '@/types';
import { formatCompact } from '@/utils/format';
import { haptic } from '@/utils/haptics';

export interface GiftOverlayProps {
  platform: PlatformMeta;
  /** Big gifts, donations and gift subs waiting to be shown; the first one is on screen. */
  queue: ChatEvent[];
  /** Called when the first one has been shown long enough. */
  onDone: (id: string) => void;
}

const SHOW_MS = 3600;

function describe(platform: PlatformMeta, event: ChatEvent): { line: string; detail?: string; huge: boolean } {
  if (event.kind === 'gift' && event.gift) {
    const total = event.gift.value * (event.count ?? 1);
    return {
      line: `sent ${event.gift.name}${event.count && event.count > 1 ? ` ×${event.count}` : ''}`,
      detail: `${formatCompact(total)} coins`,
      huge: event.gift.tier === 4,
    };
  }
  if (event.kind === 'subscribe') return { line: event.text, huge: (event.count ?? 0) >= 20 };
  return { line: moneyLabel(platform, event), detail: event.text || undefined, huge: (event.amount ?? 0) >= 100 };
}

/** The banner for the big money moments, with a burst of the matching emoji. */
export function GiftOverlay({ platform, queue, onDone }: GiftOverlayProps) {
  const current = queue[0] ?? null;
  const currentId = current?.id;
  const hearts = useRef<FloatingHeartsHandle>(null);

  useEffect(() => {
    if (!currentId) return;
    haptic.heavy();
    const head = queue[0];
    const emoji = head ? moneyEmoji(platform, head) : '🎉';
    const burst = setTimeout(() => hearts.current?.spawn(head && describe(platform, head).huge ? 14 : 8, { emoji, big: true }), 150);
    const hide = setTimeout(() => onDone(currentId), SHOW_MS);
    return () => {
      clearTimeout(burst);
      clearTimeout(hide);
    };
    // Only the event on screen matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  if (!current) return null;
  const { line, detail, huge } = describe(platform, current);

  return (
    <View style={styles.layer} pointerEvents="none">
      <Animated.View
        key={current.id}
        entering={FadeInLeft.duration(320)}
        exiting={FadeOut.duration(260)}
        style={[styles.banner, { borderColor: platform.color }, huge ? { backgroundColor: platform.color } : null]}
      >
        <Avatar generated={current.user.avatar} name={current.user.name} size={Sizes.avatarMd} />
        <View style={styles.text}>
          <AppText variant="smallBold" color="white" numberOfLines={1}>
            {current.user.name} <AppText variant="small" color={huge ? 'white' : 'textSecondary'}>{line}</AppText>
          </AppText>
          {detail ? (
            <AppText variant="small" color="white" numberOfLines={2}>
              {detail}
            </AppText>
          ) : null}
        </View>
        <Animated.Text entering={ZoomIn.springify().damping(9)} style={styles.emoji}>
          {moneyEmoji(platform, current)}
        </Animated.Text>
      </Animated.View>
      <FloatingHearts ref={hearts} height={260} color={platform.color} style={styles.burst} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', left: Spacing.lg, right: Spacing.lg, top: '36%' },
  banner: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.lg,
    borderRadius: Radii.lg,
    backgroundColor: Palette.overlay,
    borderWidth: 1,
  },
  text: { flex: 1, minWidth: 0 },
  emoji: { fontSize: 40, lineHeight: 48 },
  burst: { position: 'absolute', left: '50%', bottom: 0 },
});
