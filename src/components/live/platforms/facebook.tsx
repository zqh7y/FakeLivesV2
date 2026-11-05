/** The Facebook look: name with LIVE and viewer pills, comments in bubbles, Stars as money, reactions instead of hearts. */
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { IconButton } from '@/components/icon-button';
import { PressableScale } from '@/components/pressable-scale';
import { VerifiedBadge } from '@/components/verified-badge';
import { BotBadgeChip, Composer, CountPill, LiveTag, QuietRow, TimerPill, mediaShadow, moneyLabel, sharedStyles as s } from '@/components/live/platforms/shared';
import type { BottomBarProps, ChatItemProps, TopBarProps } from '@/components/live/platforms/types';
import { Palette, Sizes, Spacing } from '@/constants/theme';

export function TopBar({ platform, host, viewers, elapsedSec, onPressHost, onPressClose }: TopBarProps) {
  return (
    <View style={s.bar}>
      <View style={s.rowBetween}>
        <PressableScale onPress={onPressHost} style={[s.row, styles.host]} accessibilityRole="button" accessibilityLabel="Open profile">
          <Avatar uri={host.avatarUri} name={host.name} size={Sizes.avatarMd} />
          <View style={[s.flex, styles.hostText]}>
            <View style={s.nameRow}>
              <AppText variant="smallBold" color="onMedia" numberOfLines={1} style={[s.flex, mediaShadow]}>
                {host.name}
              </AppText>
              {host.verified ? <VerifiedBadge size={Sizes.verifiedSm} /> : null}
            </View>
            <View style={s.row}>
              <LiveTag color={platform.live} compact />
              <CountPill icon="eye" value={viewers} label="viewers" style={styles.smallPill} />
              <TimerPill sec={elapsedSec} />
            </View>
          </View>
        </PressableScale>
        <IconButton icon="close" label="End live" variant="glass" size={Sizes.touchSm} iconSize={20} onPress={onPressClose} />
      </View>
    </View>
  );
}

export function BottomBar({ platform, onSend, onLike, onShare }: BottomBarProps) {
  return (
    <Composer platform={platform} onSend={onSend}>
      <IconButton icon="thumbs-up" label="Like" variant="glass" size={Sizes.control} color={platform.color} onPress={onLike} />
      <IconButton icon="arrow-redo-outline" label="Share" variant="glass" size={Sizes.control} onPress={onShare} />
    </Composer>
  );
}

export const ChatItem = memo(function ChatItem({ platform, event, host }: ChatItemProps) {
  const { user, kind } = event;

  if (kind === 'join') return <QuietRow>{event.text}</QuietRow>;
  if (kind === 'follow') return <QuietRow icon="thumbs-up" color={platform.color}>{event.text}</QuietRow>;
  if (kind === 'share') return <QuietRow icon="arrow-redo">{user.name} shared your video</QuietRow>;

  if (kind === 'donation') {
    return (
      <View style={[s.row, styles.rowTop]}>
        <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarSm} />
        <View style={[s.bubble, { backgroundColor: platform.soft, borderColor: platform.color }]}>
          <AppText variant="smallBold" color="onMedia" numberOfLines={1}>
            {user.name} <AppText variant="small" color="onMediaSecondary">{moneyLabel(platform, event)} ⭐</AppText>
          </AppText>
          {event.text ? (
            <AppText variant="body" color="onMedia">
              {event.text}
            </AppText>
          ) : null}
        </View>
      </View>
    );
  }

  const isHost = kind === 'host';
  return (
    <View style={[s.row, styles.rowTop]}>
      {isHost ? <Avatar uri={host.avatarUri} name={host.name} size={Sizes.avatarSm} /> : <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarSm} />}
      <View style={[s.bubble, styles.bubble, isHost ? { backgroundColor: platform.soft, borderColor: platform.color } : null]}>
        <View style={s.nameRow}>
          {isHost ? <BotBadgeChip kind="host" seed={user.id} color={platform.color} /> : user.badge === 'top' ? <BotBadgeChip kind="top" seed={user.id} color={platform.color} /> : null}
          <AppText variant="smallBold" color="onMedia" numberOfLines={1} style={s.flex}>
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
  host: { maxWidth: '78%' },
  hostText: { gap: Spacing.xs },
  smallPill: { height: 22 },
  rowTop: { alignItems: 'flex-start' },
  bubble: { backgroundColor: Palette.glassStrong },
});
