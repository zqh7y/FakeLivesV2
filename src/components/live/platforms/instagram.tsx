/** The Instagram look: username with a LIVE tag, eye count, bare comments with a shadow, badges as money. */
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { IconButton } from '@/components/icon-button';
import { PressableScale } from '@/components/pressable-scale';
import { VerifiedBadge } from '@/components/verified-badge';
import { Composer, CountPill, LiveTag, QuietRow, mediaShadow, moneyLabel, sharedStyles as s } from '@/components/live/platforms/shared';
import type { BottomBarProps, ChatItemProps, TopBarProps } from '@/components/live/platforms/types';
import { Palette, Sizes, Spacing } from '@/constants/theme';

export function TopBar({ platform, host, viewers, onPressHost, onPressClose }: TopBarProps) {
  return (
    <View style={s.bar}>
      <View style={s.rowBetween}>
        <PressableScale onPress={onPressHost} style={[s.row, styles.host]} accessibilityRole="button" accessibilityLabel="Open profile">
          <Avatar uri={host.avatarUri} name={host.name} size={Sizes.avatarSm + 4} />
          <AppText variant="smallBold" color="onMedia" numberOfLines={1} style={[s.flex, mediaShadow]}>
            {host.username}
          </AppText>
          {host.verified ? <VerifiedBadge size={Sizes.verifiedSm} /> : null}
          <LiveTag color={platform.live} compact />
        </PressableScale>
        <View style={s.row}>
          <CountPill icon="eye" value={viewers} label="viewers" />
          <IconButton icon="close" label="End live" variant="plain" size={Sizes.touchSm} iconSize={26} onPress={onPressClose} />
        </View>
      </View>
    </View>
  );
}

export function BottomBar({ platform, onSend, onLike, onShare }: BottomBarProps) {
  return (
    <Composer platform={platform} onSend={onSend} outline>
      <IconButton icon="paper-plane-outline" label="Share" variant="plain" size={Sizes.control} iconSize={26} onPress={onShare} />
      <IconButton icon="heart-outline" label="Like" variant="plain" size={Sizes.control} iconSize={28} onPress={onLike} />
    </Composer>
  );
}

export const ChatItem = memo(function ChatItem({ platform, event, host }: ChatItemProps) {
  const { user, kind } = event;

  if (kind === 'join') return <QuietRow>{event.text}</QuietRow>;
  if (kind === 'follow') return <QuietRow icon="heart" color={platform.color}>{event.text}</QuietRow>;
  if (kind === 'share') return <QuietRow icon="paper-plane">{user.name} shared your live</QuietRow>;

  if (kind === 'donation') {
    const count = event.count ?? 1;
    return (
      <View style={[s.row, s.bubble, { backgroundColor: platform.soft, borderColor: platform.color }]}>
        <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarSm} />
        <AppText variant="small" color="onMedia" numberOfLines={2} style={s.flex}>
          <AppText variant="smallBold" color="onMedia">
            {user.name}
          </AppText>{' '}
          {moneyLabel(platform, event)}
        </AppText>
        <View style={s.nameRow}>
          {Array.from({ length: count }).map((_, i) => (
            <Ionicons key={i} name="heart" size={14} color={platform.color} />
          ))}
        </View>
      </View>
    );
  }

  const isHost = kind === 'host';
  return (
    <View style={[s.row, styles.comment, isHost ? [s.bubble, { backgroundColor: platform.soft }] : null]}>
      {isHost ? <Avatar uri={host.avatarUri} name={host.name} size={Sizes.avatarSm} /> : <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarSm} />}
      <View style={s.flex}>
        <View style={s.nameRow}>
          <AppText variant="smallBold" color="onMedia" numberOfLines={1} style={[s.flex, mediaShadow]}>
            {isHost ? host.username : user.name}
          </AppText>
          {isHost && host.verified ? <VerifiedBadge size={Sizes.verifiedSm} /> : null}
        </View>
        <AppText variant="body" color="onMedia" style={mediaShadow}>
          {event.text}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  host: { maxWidth: '62%', paddingVertical: Spacing.xs },
  comment: { alignItems: 'flex-start', paddingVertical: Spacing.xxs, backgroundColor: Palette.black + '00' },
});
