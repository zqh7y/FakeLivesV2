import { useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { PlatformUI, type HostInfo } from '@/components/live/platforms';
import type { PlatformMeta } from '@/constants/platforms';
import { Spacing } from '@/constants/theme';
import type { ChatEvent } from '@/types';

export interface ChatListProps {
  /** Newest first. */
  events: ChatEvent[];
  platform: PlatformMeta;
  host: HostInfo;
  visible?: number;
  style?: StyleProp<ViewStyle>;
}

/** The last few chat lines, newest at the bottom, older ones fading out above. Drawn in the platform's style. */
export function ChatList({ events, platform, host, visible = 11, style }: ChatListProps) {
  const shown = useMemo(() => events.slice(0, visible).reverse(), [events, visible]);
  const n = shown.length;
  const Item = PlatformUI[platform.key].ChatItem;

  return (
    <View style={[styles.column, style]} pointerEvents="none">
      {shown.map((event, index) => {
        const age = n - 1 - index; // 0 = newest
        const opacity = age < 3 ? 1 : Math.max(0.28, 1 - (age - 2) * 0.09);
        return (
          // Older lines jump up instantly and the new one slides in: no two lines ever share a spot.
          <Animated.View key={event.id} entering={FadeInUp.duration(220)}>
            <View style={{ opacity }}>
              <Item event={event} platform={platform} host={host} />
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { justifyContent: 'flex-end', gap: Spacing.xs, overflow: 'hidden' },
});
