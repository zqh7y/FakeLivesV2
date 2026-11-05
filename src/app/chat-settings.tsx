import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { IconButton } from '@/components/icon-button';
import { ModalHeader } from '@/components/modal-header';
import { Screen } from '@/components/screen';
import { SectionHeader } from '@/components/section-header';
import { Slider } from '@/components/slider';
import { TextField } from '@/components/text-field';
import { ToggleRow } from '@/components/toggle-row';
import { SpeedOptions } from '@/constants/options';
import { Palette, Sizes, Spacing } from '@/constants/theme';
import { Languages, Packs, countAllComments } from '@/data/comments';
import { MAX_CUSTOM_COMMENTS, displayNameOf, useSettingsStore } from '@/store/settings-store';
import { haptic } from '@/utils/haptics';

export default function ChatSettingsScreen() {
  const router = useRouter();
  const chat = useSettingsStore((s) => s.chat);
  const profile = useSettingsStore((s) => s.profile);
  const { setChat, togglePack, toggleLanguage, addCustomComment, removeCustomComment } = useSettingsStore.getState();
  const [draft, setDraft] = useState('');
  const speedIndex = SpeedOptions.findIndex((o) => o.key === chat.speed);
  const name = displayNameOf(profile);

  const add = () => {
    if (!draft.trim()) return;
    addCustomComment(draft);
    setDraft('');
    haptic.success();
  };

  return (
    <Screen
      scroll
      edges={['left', 'right', 'bottom']}
      header={<ModalHeader title="Chat" onClose={() => router.back()} />}
      footer={<Button title="Done" size="lg" fullWidth onPress={() => router.back()} />}
    >
      <SectionHeader title="Speed" subtitle="How fast the comments come in" />
      <Card style={styles.card}>
        <Slider value={speedIndex} min={0} max={SpeedOptions.length - 1} step={1} onChange={(v) => setChat({ speed: SpeedOptions[Math.round(v)].key })} accessibilityLabel="Chat speed" />
        <View style={styles.speedLabels}>
          {SpeedOptions.map((o, i) => (
            <AppText key={o.key} variant="small" color={i === speedIndex ? 'accent' : 'textMuted'}>
              {o.emoji} {o.label}
            </AppText>
          ))}
        </View>
      </Card>

      <SectionHeader title="Topics" subtitle={`${countAllComments()}+ lines across ${Packs.length} packs`} />
      <Card style={styles.card}>
        <View style={styles.wrap}>
          {Packs.map((p) => (
            <Chip key={p.key} label={p.name} emoji={p.emoji} selected={chat.packs.includes(p.key)} onPress={() => togglePack(p.key)} />
          ))}
        </View>
        <AppText variant="small" color="textMuted">
          {Packs.filter((p) => chat.packs.includes(p.key))
            .map((p) => p.description)
            .join(' · ')}
        </AppText>
      </Card>

      <SectionHeader title="Languages" subtitle="Mix in comments from around the world" />
      <Card style={styles.card}>
        <View style={styles.wrap}>
          {Languages.map((l) => (
            <Chip key={l.key} label={l.name} emoji={l.flag} size="sm" selected={chat.languages.includes(l.key)} onPress={() => toggleLanguage(l.key)} />
          ))}
        </View>
      </Card>

      <SectionHeader title="Events" />
      <Card style={styles.eventsCard}>
        <ToggleRow label="Joins" description="“mia.p joined”" emoji="👋" value={chat.joins} onValueChange={(joins) => setChat({ joins })} />
        <ToggleRow label="Follows" description="New followers with a toast" emoji="❤️" value={chat.follows} onValueChange={(follows) => setChat({ follows })} />
        <ToggleRow label="Gifts & donations" description="Roses, Super Chats, Stars, Bits, badges, gift subs" emoji="🎁" value={chat.gifts} onValueChange={(gifts) => setChat({ gifts })} />
        <ToggleRow label="Shares" description="People sharing your live" emoji="🔁" value={chat.shares} onValueChange={(shares) => setChat({ shares })} />
        <ToggleRow label="Mentions" description={`Comments that call you “${name}”`} emoji="📣" value={chat.mentions} onValueChange={(mentions) => setChat({ mentions })} />
        <ToggleRow
          label="Viewers hear you"
          description="Uses the microphone. The chat answers what you say and stays on your topic"
          emoji="🎤"
          value={chat.listen}
          onValueChange={(listen) => setChat({ listen })}
          last
        />
      </Card>

      <SectionHeader title="Your own comments" subtitle={`Mixed into the chat · ${chat.customComments.length}/${MAX_CUSTOM_COMMENTS}`} />
      <Card style={styles.card}>
        <TextField
          placeholder="e.g. is that really you??"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={add}
          returnKeyType="done"
          blurOnSubmit={false}
          maxLength={120}
          right={<IconButton icon="add" label="Add comment" variant="accent" size={Sizes.controlSm} iconSize={18} onPress={add} disabled={!draft.trim()} />}
        />
        {chat.customComments.length === 0 ? (
          <AppText variant="small" color="textMuted">
            Add inside jokes, your friend’s name, anything. Bots will say it.
          </AppText>
        ) : (
          <View style={styles.list}>
            {chat.customComments.map((text, index) => (
              <Animated.View key={`${index}-${text}`} entering={FadeInDown.duration(200)} exiting={FadeOut.duration(120)} layout={LinearTransition.duration(180)} style={styles.listRow}>
                <AppText variant="body" style={styles.flex} numberOfLines={2}>
                  {text}
                </AppText>
                <IconButton icon="trash-outline" label={`Remove “${text}”`} variant="plain" size={Sizes.controlSm} iconSize={18} color={Palette.textMuted} onPress={() => removeCustomComment(index)} />
              </Animated.View>
            ))}
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.lg, marginBottom: Spacing.xl },
  eventsCard: { paddingVertical: Spacing.xs, marginBottom: Spacing.xl },
  speedLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  list: { gap: Spacing.xs },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  flex: { flex: 1 },
});
