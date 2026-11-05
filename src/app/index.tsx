import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { IconButton } from '@/components/icon-button';
import { PlatformPicker } from '@/components/platform-picker';
import { Screen } from '@/components/screen';
import { SectionHeader } from '@/components/section-header';
import { Slider } from '@/components/slider';
import { TextField } from '@/components/text-field';
import { VerifiedBadge } from '@/components/verified-badge';
import { GrowthOptions, SpeedOptions, VIEWERS_HELP, ViewerPresets } from '@/constants/options';
import { Platforms } from '@/constants/platforms';
import { Palette, Sizes, Spacing } from '@/constants/theme';
import { MAX_VIEWERS, MIN_VIEWERS, displayNameOf, effectiveStats, useSettingsStore, usernameOf } from '@/store/settings-store';
import { clamp, formatCompact, parseLooseNumber } from '@/utils/format';
import { haptic } from '@/utils/haptics';
import { randInt } from '@/utils/random';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useSettingsStore((s) => s.profile);
  const audience = useSettingsStore((s) => s.audience);
  const chat = useSettingsStore((s) => s.chat);
  const platformKey = useSettingsStore((s) => s.platform);
  const { setAudience, setChat, setProfile, setPlatform, recordLiveStarted } = useSettingsStore.getState();

  const [customViewers, setCustomViewers] = useState(() => (ViewerPresets.includes(audience.viewers) ? '' : String(audience.viewers)));
  const [viewersError, setViewersError] = useState<string | undefined>();

  const name = displayNameOf(profile);
  const handle = usernameOf(profile);
  const stats = effectiveStats(profile, audience.viewers);
  const platform = Platforms[platformKey];
  const speedIndex = SpeedOptions.findIndex((o) => o.key === chat.speed);
  const eventsOn = [
    chat.joins && 'joins',
    chat.follows && 'follows',
    chat.gifts && 'gifts',
    chat.shares && 'shares',
    chat.mentions && 'mentions',
    chat.listen && 'voice',
  ].filter(Boolean) as string[];

  const onCustomViewers = (text: string) => {
    setCustomViewers(text);
    if (!text.trim()) {
      setViewersError(undefined);
      return;
    }
    const n = parseLooseNumber(text);
    if (Number.isNaN(n)) {
      setViewersError(VIEWERS_HELP);
      return;
    }
    setViewersError(undefined);
    setAudience({ viewers: clamp(n, MIN_VIEWERS, MAX_VIEWERS) });
  };

  const goLive = () => {
    if (!profile.username.trim() && !profile.displayName.trim()) {
      setProfile({ username: `user${randInt(100000, 999999)}` });
    }
    recordLiveStarted();
    haptic.success();
    router.push('/live');
  };

  return (
    <Screen
      scroll
      footer={
        <View style={styles.footer}>
          <Button title="Go live" icon="radio-outline" size="lg" fullWidth onPress={goLive} />
          <AppText variant="tiny" color="textMuted" align="center">
            NOTHING IS RECORDED OR UPLOADED
          </AppText>
        </View>
      }
    >
      <View style={styles.header}>
        <View style={styles.brand}>
          <AppText variant="h1">Fake</AppText>
          <AppText variant="h1" color="accent">
            Lives
          </AppText>
        </View>
        <IconButton icon="shield-checkmark-outline" label="Privacy" onPress={() => router.push('/privacy')} />
      </View>

      <Card onPress={() => router.push('/profile')} accessibilityLabel="Edit profile" style={styles.card}>
        <View style={styles.profileRow}>
          <Avatar uri={profile.avatarUri} name={name} size={Sizes.avatarLg} ring />
          <View style={styles.profileText}>
            <View style={styles.nameRow}>
              <AppText variant="h2" numberOfLines={1} style={styles.shrink}>
                {name}
              </AppText>
              {profile.verified ? <VerifiedBadge size={Sizes.verifiedLg} /> : null}
            </View>
            <AppText variant="small" color="textSecondary" numberOfLines={1}>
              @{handle} · {formatCompact(stats.followers)} {platform.followerNoun}
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={Sizes.icon} color={Palette.textMuted} />
        </View>
      </Card>

      <SectionHeader title="Platform" />
      <Card style={styles.card}>
        <PlatformPicker value={platformKey} onChange={setPlatform} />
      </Card>

      <SectionHeader title="Viewers" />
      <Card style={styles.card}>
        <View style={styles.viewerHero}>
          <AppText variant="display" color="accent">
            {formatCompact(audience.viewers)}
          </AppText>
          <AppText variant="small" color="textSecondary">
            {GrowthOptions.find((g) => g.key === audience.growth)?.hint}
          </AppText>
        </View>
        <View style={styles.wrap}>
          {ViewerPresets.map((n) => (
            <Chip
              key={n}
              label={formatCompact(n)}
              size="sm"
              selected={audience.viewers === n && !customViewers}
              onPress={() => {
                setCustomViewers('');
                setViewersError(undefined);
                setAudience({ viewers: n });
              }}
            />
          ))}
        </View>
        <TextField placeholder={`Custom · ${VIEWERS_HELP.replace('Try ', '')}`} value={customViewers} onChangeText={onCustomViewers} error={viewersError} autoCapitalize="none" autoCorrect={false} />
        <View style={styles.wrap}>
          {GrowthOptions.map((g) => (
            <Chip key={g.key} label={g.label} size="sm" selected={audience.growth === g.key} onPress={() => setAudience({ growth: g.key })} />
          ))}
        </View>
      </Card>

      <SectionHeader title="Chat" actionLabel="Customize" onAction={() => router.push('/chat-settings')} />
      <Card style={styles.card}>
        <View style={styles.rowBetween}>
          <AppText variant="smallBold" color="textSecondary">
            Speed
          </AppText>
          <AppText variant="smallBold" color="accent">
            {SpeedOptions[speedIndex]?.emoji} {SpeedOptions[speedIndex]?.label}
          </AppText>
        </View>
        <Slider value={speedIndex} min={0} max={SpeedOptions.length - 1} step={1} onChange={(v) => setChat({ speed: SpeedOptions[Math.round(v)].key })} accessibilityLabel="Chat speed" />
        <AppText variant="small" color="textMuted">
          {chat.packs.length} topic{chat.packs.length === 1 ? '' : 's'} · {chat.languages.length} language{chat.languages.length === 1 ? '' : 's'} · {eventsOn.length ? eventsOn.join(', ') : 'no events'}
          {chat.customComments.length ? ` · ${chat.customComments.length} of your own` : ''}
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.md, paddingBottom: Spacing.lg },
  brand: { flexDirection: 'row', alignItems: 'center' },
  card: { gap: Spacing.lg, marginBottom: Spacing.xl },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  profileText: { flex: 1, minWidth: 0, gap: Spacing.xxs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  shrink: { flexShrink: 1 },
  viewerHero: { alignItems: 'center', gap: Spacing.xxs, paddingTop: Spacing.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footer: { gap: Spacing.sm },
});
