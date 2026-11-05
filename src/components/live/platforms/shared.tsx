/** Pieces the five platform looks share: pills, badges, the composer, labels. */
import { Ionicons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppText } from '@/components/app-text';
import type { IconName } from '@/components/button';
import { NumberTicker } from '@/components/number-ticker';
import { PressableScale } from '@/components/pressable-scale';
import { TwitchNameColors, formatMoney, type PlatformMeta } from '@/constants/platforms';
import { Fonts, Palette, Radii, Sizes, Spacing, Type } from '@/constants/theme';
import type { BotBadge, ChatEvent } from '@/types';
import { formatCompact, formatDuration } from '@/utils/format';
import { hashString } from '@/utils/random';

/** Text drawn straight over the camera gets a soft shadow so it stays readable. */
export const mediaShadow: TextStyle = {
  textShadowColor: Palette.overlay,
  textShadowRadius: 4,
  textShadowOffset: { width: 0, height: 1 },
};

export function nameColorFor(name: string): string {
  return TwitchNameColors[hashString(name) % TwitchNameColors.length];
}

/** A LIVE tag in the platform's live colour. */
export function LiveTag({ color, compact, style }: { color: string; compact?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.liveTag, compact ? styles.liveTagCompact : null, { backgroundColor: color }, style]}>
      <AppText variant="tiny" color="white">
        LIVE
      </AppText>
    </View>
  );
}

/** A dark pill with an icon and a rolling number. */
export function CountPill({ icon, value, label, style }: { icon: IconName; value: number; label: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.pill, style]} accessibilityLabel={`${formatCompact(value)} ${label}`}>
      <Ionicons name={icon} size={13} color={Palette.onMedia} />
      <NumberTicker value={value} variant="smallBold" />
    </View>
  );
}

export function TimerPill({ sec, style }: { sec: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.pill, styles.timer, style]}>
      <View style={styles.recDot} />
      <AppText variant="tiny" color="onMedia">
        {formatDuration(sec)}
      </AppText>
    </View>
  );
}

/** Mod, top gifter, VIP and fan-club badges, drawn the same on every platform; the host gets the platform colour. */
export function BotBadgeChip({ kind, seed, color }: { kind: BotBadge | 'host'; seed: string; color: string }) {
  const h = hashString(seed);
  if (kind === 'host') {
    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <AppText variant="tiny" color="white">
          Host
        </AppText>
      </View>
    );
  }
  if (kind === 'mod') {
    return (
      <View style={styles.badge}>
        <Ionicons name="construct" size={9} color={Palette.white} />
      </View>
    );
  }
  if (kind === 'top') {
    return (
      <View style={styles.badge}>
        <AppText variant="tiny" color="white">
          TOP {(h % 3) + 1}
        </AppText>
      </View>
    );
  }
  if (kind === 'vip') {
    return (
      <View style={styles.badge}>
        <Ionicons name="diamond" size={9} color={Palette.white} />
      </View>
    );
  }
  return (
    <View style={styles.badge}>
      <Ionicons name="heart" size={9} color={Palette.white} />
      <AppText variant="tiny" color="white">
        {(h % 30) + 1}
      </AppText>
    </View>
  );
}

/** A quiet one-line system row: joins, follows, shares. */
export function QuietRow({ children, icon, color }: { children: ReactNode; icon?: IconName; color?: string }) {
  return (
    <View style={styles.quiet}>
      <AppText variant="small" color="onMediaSecondary" numberOfLines={1} style={[styles.flex, mediaShadow]}>
        {children}
      </AppText>
      {icon ? <Ionicons name={icon} size={12} color={color ?? Palette.onMediaSecondary} /> : null}
    </View>
  );
}

/** The comment field plus the platform's action buttons. */
export function Composer({
  platform,
  onSend,
  outline,
  children,
}: {
  platform: PlatformMeta;
  onSend: (text: string) => void;
  /** Transparent field with a border, instead of a filled one. */
  outline?: boolean;
  children?: ReactNode;
}) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;
  const send = () => {
    if (!canSend) return;
    onSend(text);
    setText('');
  };
  return (
    <View style={styles.composerRow}>
      <View style={[styles.field, outline ? styles.fieldOutline : null]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={platform.placeholder}
          placeholderTextColor={Palette.onMediaSecondary}
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={send}
          blurOnSubmit={false}
          maxLength={120}
          selectionColor={platform.color}
          cursorColor={platform.color}
          accessibilityLabel="Comment"
        />
        {canSend ? (
          <PressableScale onPress={send} style={[styles.send, { backgroundColor: platform.color }]} accessibilityRole="button" accessibilityLabel="Send">
            <Ionicons name="arrow-up" size={16} color={Palette.white} />
          </PressableScale>
        ) : (
          <Ionicons name="happy-outline" size={20} color={Palette.onMediaSecondary} />
        )}
      </View>
      {children}
    </View>
  );
}

/** What a money event is called on this platform: "$5 Super Chat", "500 Stars", "cheered 100 Bits". */
export function moneyLabel(platform: PlatformMeta, event: ChatEvent): string {
  const amount = event.amount ?? 0;
  const count = event.count ?? 0;
  switch (platform.key) {
    case 'instagram':
      return count > 1 ? `bought ${count} badges` : 'bought a badge';
    case 'youtube':
      return `${formatMoney(amount)} Super Chat`;
    case 'facebook':
      return `sent ${formatCompact(count)} Stars`;
    case 'twitch':
      return count ? `cheered ${formatCompact(count)} Bits` : `donated ${formatMoney(amount)}`;
    default:
      return `sent ${formatMoney(amount)}`;
  }
}

export function moneyEmoji(platform: PlatformMeta, event: ChatEvent): string {
  if (event.kind === 'subscribe') return '🎁';
  switch (platform.key) {
    case 'instagram':
      return '❤️';
    case 'youtube':
      return '💸';
    case 'facebook':
      return '⭐';
    case 'twitch':
      return event.count ? '💎' : '💜';
    default:
      return event.gift?.emoji ?? '🎁';
  }
}

export const sharedStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  flex: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  bar: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  hostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.pill,
    backgroundColor: Palette.scrim,
    maxWidth: '62%',
  },
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Palette.scrimLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  box: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.sm,
  },
  emoji: { fontSize: 26, lineHeight: 30 },
});

const styles = StyleSheet.create({
  liveTag: {
    paddingHorizontal: Spacing.sm,
    height: 22,
    borderRadius: Radii.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTagCompact: { height: 18, paddingHorizontal: Spacing.xs + 2 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    height: 32,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: Radii.pill,
    backgroundColor: Palette.scrim,
  },
  timer: { height: 22, paddingHorizontal: Spacing.sm, borderRadius: Radii.xs },
  recDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Palette.live },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    paddingHorizontal: Spacing.xs + 1,
    height: 15,
    borderRadius: Radii.xs,
    backgroundColor: Palette.glassStrong,
  },
  quiet: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.xxs, paddingHorizontal: Spacing.xs },
  flex: { flexShrink: 1 },
  composerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: Sizes.control,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.sm,
    borderRadius: Radii.pill,
    backgroundColor: Palette.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.borderStrong,
  },
  fieldOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Palette.onMediaSecondary },
  input: { flex: 1, color: Palette.onMedia, fontFamily: Fonts.medium, fontSize: Type.body.fontSize, paddingVertical: 0, minWidth: 0 },
  send: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
