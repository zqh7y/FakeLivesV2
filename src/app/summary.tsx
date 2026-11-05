import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { SectionHeader } from '@/components/section-header';
import { StatTile } from '@/components/stat-tile';
import { Platforms, formatMoney } from '@/constants/platforms';
import { Palette, Sizes, Spacing } from '@/constants/theme';
import { displayNameOf, useSettingsStore } from '@/store/settings-store';
import { formatCompact, formatDuration } from '@/utils/format';

export default function SummaryScreen() {
  const router = useRouter();
  const summary = useSettingsStore((s) => s.lastSummary);
  const profile = useSettingsStore((s) => s.profile);
  const platform = Platforms[useSettingsStore((s) => s.platform)];

  if (!summary) return <Redirect href="/" />;

  const isTikTok = platform.key === 'tiktok';
  const money = isTikTok ? `${formatCompact(summary.coins)} coins` : `${formatMoney(summary.donations)} in ${platform.moneyNoun}`;
  const extras = [money, summary.subs ? `${summary.subs} subs` : null, `${formatCompact(summary.shares)} shares`].filter(Boolean).join(' · ');

  const tiles = [
    { value: formatCompact(summary.peakViewers), label: 'Peak viewers', tone: 'accent' as const },
    platform.hearts ? { value: formatCompact(summary.likes), label: 'Likes' } : { value: formatCompact(summary.subs), label: 'New subs' },
    { value: `+${formatCompact(summary.newFollowers)}`, label: `New ${platform.followerNoun}` },
    { value: formatCompact(summary.totalComments), label: 'Comments' },
  ];

  return (
    <Screen
      scroll
      footer={
        <View style={styles.footer}>
          <Button title="Go live again" icon="radio-outline" size="lg" fullWidth onPress={() => router.replace('/live')} />
          <Button title="Back to home" variant="ghost" fullWidth onPress={() => router.replace('/')} />
        </View>
      }
    >
      <View style={styles.hero}>
        <Avatar uri={profile.avatarUri} name={displayNameOf(profile)} size={Sizes.avatarLg} ring />
        <AppText variant="h1">Live ended</AppText>
        <AppText variant="body" color="textSecondary" align="center">
          {platform.name} · {formatDuration(summary.durationSec)} · {extras}
        </AppText>
      </View>

      <View style={styles.grid}>
        {tiles.map((t, i) => (
          <Animated.View key={t.label} entering={FadeInDown.delay(70 * i).duration(300)} style={styles.tile}>
            <StatTile value={t.value} label={t.label} tone={t.tone} />
          </Animated.View>
        ))}
      </View>

      <SectionHeader title="Top fans" />
      <Card padded={false} style={styles.fans}>
        {summary.topFans.length === 0 ? (
          <AppText variant="body" color="textMuted" style={styles.empty}>
            Nobody sent anything this time.
          </AppText>
        ) : (
          summary.topFans.map((fan, i) => (
            <View key={fan.user.id} style={[styles.fanRow, i < summary.topFans.length - 1 ? styles.divider : null]}>
              <AppText variant="h3" color={i === 0 ? 'accent' : 'textMuted'} style={styles.rank}>
                {i + 1}
              </AppText>
              <Avatar generated={fan.user.avatar} name={fan.user.name} size={Sizes.avatarMd} />
              <View style={styles.fanText}>
                <AppText variant="bodyBold" numberOfLines={1}>
                  {fan.user.name}
                </AppText>
                <AppText variant="small" color="textSecondary">
                  {fan.comments} comment{fan.comments === 1 ? '' : 's'}
                </AppText>
              </View>
              <View style={styles.coins}>
                <Ionicons name={isTikTok ? 'diamond' : 'cash'} size={Sizes.iconSm} color={Palette.accent} />
                <AppText variant="smallBold" color="accent">
                  {isTikTok ? formatCompact(fan.coins) : formatMoney(fan.donations)}
                </AppText>
              </View>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: Spacing.sm, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  tile: { flexBasis: '47%', flexGrow: 1 },
  fans: { marginBottom: Spacing.xl },
  empty: { padding: Spacing.lg },
  fanRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  rank: { width: Spacing.xl, textAlign: 'center' },
  fanText: { flex: 1, minWidth: 0 },
  coins: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  footer: { gap: Spacing.sm },
});
