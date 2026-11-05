import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { StatTile } from '@/components/stat-tile';
import { VerifiedBadge } from '@/components/verified-badge';
import { Palette, Radii, Sizes, Spacing } from '@/constants/theme';
import { formatCompact } from '@/utils/format';

export interface ProfileSheetProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  username: string;
  bio: string;
  avatarUri: string | null;
  verified: boolean;
  followers: number;
  likes: number;
  following: number;
  followerNoun?: string;
  /** Platform colour for the Follow button. */
  color?: string;
}

/** The host's profile card, slid up over the live. */
export function ProfileSheet({ visible, onClose, name, username, bio, avatarUri, verified, followers, likes, following, followerNoun = 'Followers', color }: ProfileSheetProps) {
  const insets = useSafeAreaInsets();
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(180)} style={StyleSheet.absoluteFill}>
        <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onClose} accessibilityLabel="Close profile" />
      </Animated.View>
      <Animated.View
        entering={SlideInDown.duration(320)}
        exiting={SlideOutDown.duration(220)}
        style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, Spacing.lg) + Spacing.sm }]}
      >
        <View style={styles.grabber} />
        <Avatar uri={avatarUri} name={name} size={Sizes.avatarXl} ring />
        <View style={styles.nameRow}>
          <AppText variant="h2">{name}</AppText>
          {verified ? <VerifiedBadge size={Sizes.verifiedLg} /> : null}
        </View>
        <AppText variant="small" color="textSecondary">
          @{username}
        </AppText>
        {bio ? (
          <AppText variant="body" color="textSecondary" align="center" style={styles.bio}>
            {bio}
          </AppText>
        ) : null}
        <View style={styles.stats}>
          <StatTile value={formatCompact(followers)} label={followerNoun} />
          <StatTile value={formatCompact(likes)} label="Likes" />
          <StatTile value={formatCompact(following)} label="Following" />
        </View>
        <View style={styles.actions}>
          <Button title="Follow" icon="add" fullWidth style={[styles.flex, color ? { backgroundColor: color, shadowColor: color } : null]} onPress={onClose} />
          <Button title="Message" variant="secondary" fullWidth style={styles.flex} onPress={onClose} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: Palette.overlay },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    backgroundColor: Palette.bgElevated,
  },
  grabber: { width: 36, height: 4, borderRadius: 2, backgroundColor: Palette.borderStrong, marginBottom: Spacing.sm },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs },
  bio: { marginTop: Spacing.xs },
  stats: { flexDirection: 'row', gap: Spacing.sm, alignSelf: 'stretch', marginTop: Spacing.md },
  actions: { flexDirection: 'row', gap: Spacing.sm, alignSelf: 'stretch', marginTop: Spacing.sm },
  flex: { flex: 1 },
});
