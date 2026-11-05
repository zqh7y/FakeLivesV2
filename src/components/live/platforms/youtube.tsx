/** The YouTube look: channel row with "watching", a square LIVE tag, Super Chats in tier colours, members in green. */
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { IconButton } from '@/components/icon-button';
import { PressableScale } from '@/components/pressable-scale';
import { Composer, LiveTag, QuietRow, mediaShadow, moneyLabel, sharedStyles as s } from '@/components/live/platforms/shared';
import type { BottomBarProps, ChatItemProps, TopBarProps } from '@/components/live/platforms/types';
import { formatMoney, superChatTier } from '@/constants/platforms';
import { Palette, Radii, Sizes, Spacing } from '@/constants/theme';
import { formatCompact } from '@/utils/format';

/** YouTube draws members in its own green. */
const MEMBER_GREEN = '#0F9D58';

export function TopBar({ platform, host, likes, viewers, onPressHost, onPressClose }: TopBarProps) {
  return (
    <View style={s.bar}>
      <View style={s.rowBetween}>
        <PressableScale onPress={onPressHost} style={[s.row, styles.host]} accessibilityRole="button" accessibilityLabel="Open profile">
          <Avatar uri={host.avatarUri} name={host.name} size={Sizes.avatarSm + 4} />
          <View style={s.flex}>
            <View style={s.nameRow}>
              <AppText variant="smallBold" color="onMedia" numberOfLines={1} style={[s.flex, mediaShadow]}>
                {host.name}
              </AppText>
              {host.verified ? <Ionicons name="checkmark-circle" size={Sizes.verifiedSm} color={Palette.onMediaSecondary} /> : null}
            </View>
            <AppText variant="tiny" color="onMediaSecondary" style={mediaShadow}>
              {formatCompact(viewers)} watching
            </AppText>
          </View>
        </PressableScale>
        <View style={s.row}>
          <View style={styles.likes}>
            <Ionicons name="thumbs-up" size={13} color={Palette.onMedia} />
            <AppText variant="smallBold" color="onMedia">
              {formatCompact(likes)}
            </AppText>
          </View>
          <LiveTag color={platform.live} />
          <IconButton icon="close" label="End live" variant="glass" size={Sizes.touchSm} iconSize={20} onPress={onPressClose} />
        </View>
      </View>
    </View>
  );
}

export function BottomBar({ platform, onSend, onLike, onShare }: BottomBarProps) {
  return (
    <Composer platform={platform} onSend={onSend}>
      <IconButton icon="thumbs-up-outline" label="Like" variant="glass" size={Sizes.control} onPress={onLike} />
      <IconButton icon="arrow-redo-outline" label="Share" variant="glass" size={Sizes.control} onPress={onShare} />
    </Composer>
  );
}

export const ChatItem = memo(function ChatItem({ platform, event, host }: ChatItemProps) {
  const { user, kind } = event;

  if (kind === 'join') return <QuietRow>{event.text}</QuietRow>;
  if (kind === 'follow') return <QuietRow icon="notifications">{user.name} subscribed</QuietRow>;
  if (kind === 'share') return <QuietRow icon="arrow-redo">{user.name} shared the stream</QuietRow>;

  if (kind === 'donation') {
    const tier = superChatTier(event.amount ?? 1);
    return (
      <View style={[s.box, styles.superChat, { backgroundColor: tier.bg }]}>
        <View style={s.rowBetween}>
          <View style={[s.row, s.flex]}>
            <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarXs} />
            <AppText variant="smallBold" color={tier.fg} numberOfLines={1} style={s.flex}>
              {user.name}
            </AppText>
          </View>
          <AppText variant="smallBold" color={tier.fg}>
            {formatMoney(event.amount ?? 0)}
          </AppText>
        </View>
        {event.text ? (
          <AppText variant="body" color={tier.fg}>
            {event.text}
          </AppText>
        ) : (
          <AppText variant="small" color={tier.fg}>
            {moneyLabel(platform, event)}
          </AppText>
        )}
      </View>
    );
  }

  if (kind === 'subscribe') {
    return (
      <View style={[s.row, s.box, { backgroundColor: MEMBER_GREEN }]}>
        <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarXs} />
        <AppText variant="small" color="white" numberOfLines={2} style={s.flex}>
          <AppText variant="smallBold" color="white">
            {user.name}
          </AppText>{' '}
          {event.text}
        </AppText>
      </View>
    );
  }

  const isHost = kind === 'host';
  return (
    <View style={[s.row, styles.comment]}>
      {isHost ? <Avatar uri={host.avatarUri} name={host.name} size={Sizes.avatarXs} /> : <Avatar generated={user.avatar} name={user.name} size={Sizes.avatarXs} />}
      <AppText variant="body" color="onMedia" style={[s.flex, mediaShadow]}>
        {isHost ? (
          <AppText variant="smallBold" color="white" style={[styles.ownerName, { backgroundColor: platform.color }]}>
            {' '}
            {host.name}{' '}
          </AppText>
        ) : (
          <AppText variant="small" color="onMediaSecondary">
            {user.name}
          </AppText>
        )}
        {'  '}
        {event.text}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  host: { maxWidth: '55%' },
  likes: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, height: 32, paddingHorizontal: Spacing.sm + 2, borderRadius: Radii.pill, backgroundColor: Palette.scrim },
  superChat: { alignSelf: 'stretch', gap: Spacing.xs },
  comment: { alignItems: 'flex-start', paddingVertical: Spacing.xxs },
  ownerName: { borderRadius: Radii.xs, overflow: 'hidden' },
});
