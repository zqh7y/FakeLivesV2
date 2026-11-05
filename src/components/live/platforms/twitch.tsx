/** The Twitch look: channel row with LIVE and a viewer count, coloured usernames, subs, Bits and raids. No hearts. */
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { IconButton } from '@/components/icon-button';
import { PressableScale } from '@/components/pressable-scale';
import { Composer, CountPill, LiveTag, QuietRow, TimerPill, mediaShadow, moneyLabel, nameColorFor, sharedStyles as s } from '@/components/live/platforms/shared';
import type { BottomBarProps, ChatItemProps, TopBarProps } from '@/components/live/platforms/types';
import { Palette, Radii, Sizes, Spacing } from '@/constants/theme';
import type { BotBadge } from '@/types';
import { formatCompact } from '@/utils/format';
import { hashString } from '@/utils/random';

export function TopBar({ platform, host, viewers, elapsedSec, onPressHost, onPressClose }: TopBarProps) {
  return (
    <View style={s.bar}>
      <View style={s.rowBetween}>
        <PressableScale onPress={onPressHost} style={[s.row, styles.host]} accessibilityRole="button" accessibilityLabel="Open profile">
          <Avatar uri={host.avatarUri} name={host.name} size={Sizes.avatarSm + 4} />
          <View style={[s.flex, styles.hostText]}>
            <AppText variant="smallBold" color="onMedia" numberOfLines={1} style={mediaShadow}>
              {host.name}
            </AppText>
            <View style={s.row}>
              <LiveTag color={platform.live} compact />
              <CountPill icon="person" value={viewers} label="viewers" style={styles.smallPill} />
            </View>
          </View>
        </PressableScale>
        <View style={s.row}>
          <TimerPill sec={elapsedSec} />
          <IconButton icon="close" label="End live" variant="glass" size={Sizes.touchSm} iconSize={20} onPress={onPressClose} />
        </View>
      </View>
    </View>
  );
}

export function BottomBar({ platform, onSend, onGift, onShare }: BottomBarProps) {
  return (
    <Composer platform={platform} onSend={onSend}>
      <IconButton icon="diamond-outline" label="Bits" variant="glass" size={Sizes.control} color={platform.color} onPress={onGift} />
      <IconButton icon="share-social-outline" label="Share" variant="glass" size={Sizes.control} onPress={onShare} />
    </Composer>
  );
}

/** Twitch draws moderators in green and VIPs in pink. */
const MOD_GREEN = '#00AD03';
const VIP_PINK = '#E005B9';

function TwitchBadge({ kind, color }: { kind: BotBadge | 'host'; color: string }) {
  const icon = kind === 'host' ? 'videocam' : kind === 'mod' ? 'shield' : kind === 'vip' ? 'diamond' : kind === 'top' ? 'trophy' : 'star';
  const bg = kind === 'mod' ? MOD_GREEN : kind === 'vip' ? VIP_PINK : color;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={9} color={Palette.white} />
    </View>
  );
}

export const ChatItem = memo(function ChatItem({ platform, event, host }: ChatItemProps) {
  const { user, kind } = event;

  if (kind === 'join') return <QuietRow>{event.text}</QuietRow>;
  if (kind === 'follow') return <QuietRow icon="heart" color={platform.color}>{user.name} followed</QuietRow>;

  if (kind === 'share') {
    const party = (hashString(event.id) % 300) + 5;
    return (
      <View style={[s.box, styles.event, { backgroundColor: platform.soft, borderLeftColor: platform.color }]}>
        <AppText variant="small" color="onMedia">
          <AppText variant="smallBold" color="onMedia">
            {user.name}
          </AppText>{' '}
          is raiding with a party of {party}!
        </AppText>
      </View>
    );
  }

  if (kind === 'subscribe') {
    return (
      <View style={[s.box, styles.event, { backgroundColor: platform.soft, borderLeftColor: platform.color }]}>
        <AppText variant="small" color="onMedia">
          <Ionicons name="star" size={12} color={platform.color} />{' '}
          <AppText variant="smallBold" color="onMedia">
            {user.name}
          </AppText>{' '}
          {event.text}
        </AppText>
      </View>
    );
  }

  if (kind === 'donation') {
    if (event.count) {
      return (
        <View style={styles.line}>
          <AppText variant="body" color="onMedia" style={mediaShadow}>
            <AppText variant="smallBold" color={nameColorFor(user.name)}>
              {user.name}
            </AppText>
            {': '}
            <AppText variant="smallBold" color={platform.color}>
              Cheer{event.count}
            </AppText>{' '}
            {event.text}
          </AppText>
        </View>
      );
    }
    return (
      <View style={[s.box, styles.event, { backgroundColor: platform.soft, borderLeftColor: platform.color }]}>
        <AppText variant="small" color="onMedia">
          <AppText variant="smallBold" color="onMedia">
            {user.name}
          </AppText>{' '}
          {moneyLabel(platform, event)}
          {event.amount && event.amount >= 100 ? ` (${formatCompact(event.amount * 100)} Bits)` : ''}
        </AppText>
        {event.text ? (
          <AppText variant="body" color="onMedia">
            {event.text}
          </AppText>
        ) : null}
      </View>
    );
  }

  const isHost = kind === 'host';
  return (
    <View style={styles.line}>
      <AppText variant="body" color="onMedia" style={mediaShadow}>
        {isHost ? <TwitchBadge kind="host" color={platform.color} /> : user.badge ? <TwitchBadge kind={user.badge} color={platform.color} /> : null}
        {isHost || user.badge ? ' ' : ''}
        <AppText variant="smallBold" color={isHost ? platform.color : nameColorFor(user.name)}>
          {isHost ? host.name : user.name}
        </AppText>
        {': '}
        {event.text}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  host: { maxWidth: '62%' },
  hostText: { gap: Spacing.xs },
  smallPill: { height: 22 },
  line: { paddingVertical: Spacing.xxs, paddingHorizontal: Spacing.xs },
  event: { alignSelf: 'stretch', borderLeftWidth: 3, borderRadius: Radii.xs, gap: Spacing.xxs },
  badge: { width: 16, height: 16, borderRadius: Radii.xs, alignItems: 'center', justifyContent: 'center' },
});
