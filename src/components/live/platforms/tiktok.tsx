/** The TikTok look: host pill with likes, viewer peek, LIVE and timer, pill chat, gifts in coins. */
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { IconButton } from '@/components/icon-button';
import { NumberTicker } from '@/components/number-ticker';
import { PressableScale } from '@/components/pressable-scale';
import { VerifiedBadge } from '@/components/verified-badge';
import { BotBadgeChip, Composer, LiveTag, QuietRow, TimerPill, sharedStyles as s } from '@/components/live/platforms/shared';
import type { BottomBarProps, ChatItemProps, TopBarProps } from '@/components/live/platforms/types';
import { Palette, Radii, Sizes, Spacing } from '@/constants/theme';
import { generateAvatar } from '@/data/avatars';
import { formatCompact } from '@/utils/format';

const peekAvatars = ['mia.p', 'jay 💀', 'nova.gg'].map((n) => generateAvatar(n));

export function TopBar({ platform, host, likes, viewers, elapsedSec, onPressHost, onPressClose }: TopBarProps) {
  return (
    <View style={s.bar}>
      <View style={s.rowBetween}>
        <PressableScale onPress={onPressHost} style={[s.hostPill, styles.hostPill]} accessibilityRole="button" accessibilityLabel="Open profile">
          <Avatar uri={host.avatarUri} name={host.name} size={Sizes.avatarSm + 4} />
          <View style={s.flex}>
            <View style={s.nameRow}>
              <AppText variant="smallBold" color="onMedia" numberOfLines={1} style={s.flex}>
                {host.name}
              </AppText>
              {host.verified ? <VerifiedBadge size={Sizes.verifiedSm} /> : null}
            </View>
            <View style={s.nameRow}>
              <Ionicons name="heart" size={10} color={platform.color} />
              <AppText variant="tiny" color="onMediaSecondary">
                {formatCompact(likes)}
              </AppText>
            </View>
          </View>
          <View style={[styles.followDot, { backgroundColor: platform.color }]}>
            <Ionicons name="add" size={16} color={Palette.white} />
          </View>
        </PressableScale>

        <View style={s.row}>
          <View style={styles.viewers} accessibilityLabel={`${formatCompact(viewers)} viewers`}>
            <View style={styles.peek}>
              {peekAvatars.map((a, i) => (
                <View key={i} style={[styles.peekItem, i > 0 ? styles.peekOverlap : null]}>
                  <Avatar generated={a} size={Sizes.avatarXs} />
                </View>
              ))}
            </View>
            <Ionicons name="eye" size={13} color={Palette.onMedia} />
            <NumberTicker value={viewers} variant="smallBold" />
          </View>
          <IconButton icon="close" label="End live" variant="glass" size={Sizes.touchSm} iconSize={20} onPress={onPressClose} />
        </View>
      </View>
      <View style={s.row}>
        <LiveTag color={platform.live} compact />
        <TimerPill sec={elapsedSec} />
      </View>
    </View>
  );
}

export function BottomBar({ platform, onSend, onLike, onGift, onShare }: BottomBarProps) {
  return (
    <Composer platform={platform} onSend={onSend}>
      <IconButton icon="arrow-redo-outline" label="Share" variant="glass" size={Sizes.control} onPress={onShare} />
      <IconButton icon="gift-outline" label="Gift" variant="glass" size={Sizes.control} onPress={onGift} />
      <IconButton icon="heart" label="Like" variant="glass" size={Sizes.control} iconSize={24} color={platform.color} onPress={onLike} />
    </Composer>
  );
}

export const ChatItem = memo(function ChatItem({ platform, event, host }: ChatItemProps) {
  const { user, kind } = event;

  if (kind === 'join') {
    return (
      <View style={s.row}>
        <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarXs} />
        <QuietRow>{event.text}</QuietRow>
      </View>
    );
  }

  if (kind === 'follow' || kind === 'share') {
    return (
      <View style={[s.row, s.bubble, { backgroundColor: platform.soft, borderColor: platform.color }]}>
        <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarSm} />
        <AppText variant="small" color="onMedia" numberOfLines={1} style={s.flex}>
          {event.text}
        </AppText>
        <Ionicons name={kind === 'follow' ? 'heart' : 'arrow-redo'} size={14} color={platform.color} />
      </View>
    );
  }

  if (kind === 'gift' && event.gift) {
    const total = event.gift.value * (event.count ?? 1);
    return (
      <View style={[s.row, s.bubble, { backgroundColor: platform.soft, borderColor: platform.color }]}>
        <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarSm} />
        <View style={s.flex}>
          <AppText variant="smallBold" color="onMediaSecondary" numberOfLines={1}>
            {user.name}
          </AppText>
          <AppText variant="small" color="onMedia" numberOfLines={1}>
            sent {event.gift.name}
            {event.count && event.count > 1 ? ` ×${event.count}` : ''}
            <AppText variant="small" color={platform.color}>
              {'  '}
              {formatCompact(total)} coins
            </AppText>
          </AppText>
        </View>
        <AppText style={s.emoji}>{event.gift.emoji}</AppText>
      </View>
    );
  }

  const isHost = kind === 'host';
  return (
    <View style={[s.row, s.bubble, isHost ? { borderColor: platform.color, backgroundColor: Palette.scrim } : null]}>
      {isHost ? <Avatar uri={host.avatarUri} name={host.name} size={Sizes.avatarSm} /> : <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarSm} />}
      <View style={s.flex}>
        <View style={s.nameRow}>
          {isHost ? <BotBadgeChip kind="host" seed={user.id} color={platform.color} /> : user.badge ? <BotBadgeChip kind={user.badge} seed={user.id} color={platform.color} /> : null}
          <AppText variant="smallBold" color={isHost ? 'onMedia' : 'onMediaSecondary'} numberOfLines={1} style={s.flex}>
            {user.name}
          </AppText>
          {isHost && host.verified ? <VerifiedBadge size={Sizes.verifiedSm} /> : null}
        </View>
        <AppText variant="body" color="onMedia">
          {event.text}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  hostPill: { paddingLeft: 3, paddingRight: Spacing.xs, paddingVertical: 3 },
  followDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.xs },
  viewers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    height: 32,
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.sm + 2,
    borderRadius: Radii.pill,
    backgroundColor: Palette.scrim,
  },
  peek: { flexDirection: 'row', alignItems: 'center', marginRight: Spacing.xxs },
  peekItem: { borderRadius: 12, borderWidth: 1.5, borderColor: Palette.overlay },
  peekOverlap: { marginLeft: -8 },
});
