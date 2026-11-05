import { useKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { IconButton, type IconButtonProps } from '@/components/icon-button';
import { ChatList } from '@/components/live/chat-list';
import { EndConfirm } from '@/components/live/end-confirm';
import { FloatingHearts, type FloatingHeartsHandle } from '@/components/live/floating-hearts';
import { GiftOverlay } from '@/components/live/gift-overlay';
import { FilterNames, FilterOrder, LiveCamera } from '@/components/live/live-camera';
import { PlatformUI, type HostInfo } from '@/components/live/platforms';
import { ProfileSheet } from '@/components/live/profile-sheet';
import { ToastStack } from '@/components/live/toast-stack';
import { FacebookReactions, Platforms } from '@/constants/platforms';
import { Palette, Radii, Sizes, Spacing } from '@/constants/theme';
import { makeBot } from '@/engine/bots';
import type { EngineConfig } from '@/engine/live-engine';
import { useLiveSession } from '@/hooks/use-live-session';
import { useSpeechListener } from '@/hooks/use-speech-listener';
import { displayNameOf, effectiveStats, useSettingsStore, usernameOf } from '@/store/settings-store';
import type { ChatEvent, FilterKey } from '@/types';
import { haptic } from '@/utils/haptics';
import { pick, randInt, uid } from '@/utils/random';

/** How far the dark scrims reach past the bars they protect. */
const SCRIM_TOP_EXTRA = 150;
const SCRIM_BOTTOM_EXTRA = 140;
/** The chat column takes this share of the screen, up to a cap. */
const CHAT_HEIGHT_SHARE = 0.42;
const CHAT_HEIGHT_MAX = 420;
const HINT_MS = 1100;

/** Keeps the screen on while live. Native only: the web wake lock throws when the screen closes early. */
function KeepAwake() {
  useKeepAwake();
  return null;
}

export default function LiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  // Settings are read once: the live runs with what was set when it started.
  const settings = useMemo(() => useSettingsStore.getState(), []);
  const { profile, audience, chat } = settings;
  const platform = Platforms[settings.platform];
  const UI = PlatformUI[platform.key];
  const name = displayNameOf(profile);
  const host = useMemo<HostInfo>(
    () => ({ name, username: usernameOf(profile), avatarUri: profile.avatarUri, verified: profile.verified }),
    [name, profile],
  );
  const stats = effectiveStats(profile, audience.viewers);

  const config = useMemo<EngineConfig>(
    () => ({
      platform: platform.key,
      viewers: audience.viewers,
      growth: audience.growth,
      speed: chat.speed,
      packs: chat.packs,
      languages: chat.languages,
      joins: chat.joins,
      follows: chat.follows,
      gifts: chat.gifts,
      shares: chat.shares,
      mentions: chat.mentions,
      customComments: chat.customComments,
      hostName: name,
    }),
    [audience, chat, name, platform.key],
  );

  const hearts = useRef<FloatingHeartsHandle>(null);
  const [giftQueue, setGiftQueue] = useState<ChatEvent[]>([]);
  const [toastQueue, setToastQueue] = useState<ChatEvent[]>([]);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [mirror, setMirror] = useState(settings.mirrorFront);
  const [filter, setFilter] = useState<FilterKey>(settings.filter);
  const [hint, setHint] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const session = useLiveSession(config, {
    onLikeBurst: (n) => {
      if (!platform.hearts) return;
      hearts.current?.spawn(n, platform.key === 'facebook' ? { emoji: pick(FacebookReactions) } : undefined);
    },
    onBigGift: (e) => setGiftQueue((q) => [...q, e]),
    onToast: (e) => setToastQueue((q) => [...q, e]),
  });
  const { snapshot } = session;

  const speech = useSpeechListener({
    enabled: chat.listen,
    onPhrase: (text) => session.hostSpeech(text),
    onUnavailable: (reason) => setHint(reason),
  });

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showProfile) setShowProfile(false);
      else if (confirmEnd) setConfirmEnd(false);
      else setConfirmEnd(true);
      return true;
    });
    return () => sub.remove();
  }, [showProfile, confirmEnd]);

  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), hint.length > 24 ? HINT_MS * 2.5 : HINT_MS);
    return () => clearTimeout(t);
  }, [hint]);

  const endLive = () => {
    speech.stop();
    const summary = session.end();
    if (summary) useSettingsStore.getState().setLastSummary(summary);
    router.replace('/summary');
  };

  const like = () => {
    if (platform.hearts) hearts.current?.spawn(randInt(2, 4), platform.key === 'facebook' ? { emoji: '👍' } : undefined);
    session.addHostLike();
  };

  const share = () => {
    haptic.success();
    setToastQueue((q) => [...q, { id: uid('ev'), kind: 'share', user: makeBot(name), text: 'Link copied · shared to your story', at: Date.now() }]);
  };

  const giftTap = () => {
    haptic.medium();
    hearts.current?.spawn(6, { emoji: platform.key === 'tiktok' ? pick(['🌹', '💎', '🎁', '🦢', '🎉']) : platform.key === 'twitch' ? '💎' : platform.key === 'facebook' ? '⭐' : '💸', big: true });
  };

  const cycleFilter = () => {
    const next = FilterOrder[(FilterOrder.indexOf(filter) + 1) % FilterOrder.length];
    setFilter(next);
    setHint(FilterNames[next]);
    useSettingsStore.getState().setFilter(next);
  };

  const toggleMirror = () => {
    setMirror((m) => {
      useSettingsStore.getState().setMirrorFront(!m);
      return !m;
    });
  };

  const toggleListen = () => {
    if (speech.listening) {
      speech.stop();
      setHint('Mic off');
    } else {
      speech.start();
    }
  };

  const chatHeight = Math.min(height * CHAT_HEIGHT_SHARE, CHAT_HEIGHT_MAX);
  const bottomInset = Math.max(insets.bottom, Spacing.md);

  return (
    <View style={styles.root}>
      {Platform.OS !== 'web' ? <KeepAwake /> : null}
      <LiveCamera facing={facing} mirror={mirror} filter={filter} />
      <LinearGradient colors={Palette.scrimTop} style={[styles.scrim, { top: 0, height: insets.top + SCRIM_TOP_EXTRA }]} pointerEvents="none" />
      <LinearGradient colors={Palette.scrimBottom} style={[styles.scrim, { bottom: 0, height: chatHeight + SCRIM_BOTTOM_EXTRA }]} pointerEvents="none" />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ paddingTop: insets.top + Spacing.sm }}>
          <UI.TopBar
            platform={platform}
            host={host}
            likes={snapshot.likes}
            viewers={snapshot.viewers}
            elapsedSec={snapshot.elapsedSec}
            onPressHost={() => setShowProfile(true)}
            onPressClose={() => setConfirmEnd(true)}
          />
        </View>

        <View style={styles.flex} pointerEvents="box-none">
          <View style={styles.sideActions}>
            <SideAction icon="camera-reverse-outline" label="Flip" onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))} />
            <SideAction icon="color-filter-outline" label="Filter" onPress={cycleFilter} />
            {facing === 'front' ? <SideAction icon="swap-horizontal-outline" label="Mirror" onPress={toggleMirror} /> : null}
            <SideAction icon="sparkles-outline" label="Effects" onPress={() => hearts.current?.spawn(10, { emoji: pick(['✨', '⭐', '💫', '🔥']) })} />
            <SideAction
              icon={speech.listening ? 'mic' : 'mic-off-outline'}
              label={speech.listening ? 'Listening' : 'Listen'}
              activeColor={speech.listening ? platform.color : undefined}
              onPress={toggleListen}
            />
          </View>
        </View>

        <View style={[styles.bottom, { paddingBottom: bottomInset }]} pointerEvents="box-none">
          <ChatList events={session.events} platform={platform} host={host} style={[styles.chat, { height: chatHeight }]} />
          <UI.BottomBar platform={platform} onSend={session.sendHostComment} onLike={like} onGift={giftTap} onShare={share} />
        </View>
      </KeyboardAvoidingView>

      <FloatingHearts ref={hearts} color={platform.color} style={[styles.hearts, { bottom: bottomInset + Sizes.control + Spacing.lg }]} />
      <ToastStack queue={toastQueue} color={platform.color} onDone={(id) => setToastQueue((q) => q.filter((e) => e.id !== id))} style={{ top: insets.top + Sizes.control + Sizes.touchSm + Spacing.xl }} />
      <GiftOverlay platform={platform} queue={giftQueue} onDone={(id) => setGiftQueue((q) => q.filter((e) => e.id !== id))} />

      {hint ? (
        <Animated.View entering={FadeIn.duration(120)} exiting={FadeOut.duration(200)} style={styles.hint} pointerEvents="none">
          <AppText variant="h3" color="onMedia" align="center">
            {hint}
          </AppText>
        </Animated.View>
      ) : null}

      <ProfileSheet
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        name={name}
        username={host.username}
        bio={profile.bio}
        avatarUri={profile.avatarUri}
        verified={profile.verified}
        followers={stats.followers + snapshot.followers}
        likes={stats.likes + snapshot.likes}
        following={stats.following}
        followerNoun={platform.followerNoun}
        color={platform.color}
      />
      <EndConfirm visible={confirmEnd} viewers={snapshot.viewers} elapsedSec={snapshot.elapsedSec} onEnd={endLive} onCancel={() => setConfirmEnd(false)} />
    </View>
  );
}

function SideAction({ icon, label, onPress, activeColor }: { icon: IconButtonProps['icon']; label: string; onPress: () => void; activeColor?: string }) {
  return (
    <View style={styles.sideAction}>
      <IconButton icon={icon} label={label} variant="glass" size={Sizes.control} onPress={onPress} style={activeColor ? { backgroundColor: activeColor } : null} />
      <AppText variant="tiny" color="onMedia">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.black },
  flex: { flex: 1 },
  scrim: { position: 'absolute', left: 0, right: 0 },
  sideActions: { position: 'absolute', right: Spacing.md, top: Spacing.xxl, gap: Spacing.lg, alignItems: 'center' },
  sideAction: { alignItems: 'center', gap: Spacing.xs },
  bottom: { gap: Spacing.sm },
  chat: { marginHorizontal: Spacing.md, maxWidth: '78%' },
  hearts: { position: 'absolute', right: Spacing.lg },
  hint: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    maxWidth: '80%',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.pill,
    backgroundColor: Palette.overlay,
  },
});
