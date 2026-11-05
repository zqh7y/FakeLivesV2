import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ModalHeader } from '@/components/modal-header';
import { Screen } from '@/components/screen';
import { SectionHeader } from '@/components/section-header';
import { TextField } from '@/components/text-field';
import { ToggleRow } from '@/components/toggle-row';
import { VIEWERS_HELP } from '@/app/index';
import { Sizes, Spacing } from '@/constants/theme';
import { deriveStats, displayNameOf, useSettingsStore } from '@/store/settings-store';
import { formatCompact, parseLooseNumber } from '@/utils/format';
import { haptic } from '@/utils/haptics';

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useSettingsStore((s) => s.profile);
  const viewers = useSettingsStore((s) => s.audience.viewers);
  const setProfile = useSettingsStore((s) => s.setProfile);
  const auto = deriveStats(viewers);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setProfile({ avatarUri: result.assets[0].uri });
        haptic.success();
      }
    } catch {
      // The picker is unavailable on this device; keep the current picture.
    }
  };

  return (
    <Screen
      scroll
      edges={['left', 'right', 'bottom']}
      header={<ModalHeader title="Edit profile" onClose={() => router.back()} />}
      footer={<Button title="Done" size="lg" fullWidth onPress={() => router.back()} />}
    >
      <View style={styles.avatarBlock}>
        <Avatar uri={profile.avatarUri} name={displayNameOf(profile)} size={Sizes.avatarXl} ring />
        <View style={styles.avatarActions}>
          <Button title="Change photo" icon="image-outline" variant="secondary" size="sm" onPress={pickImage} />
          {profile.avatarUri ? <Button title="Remove" variant="ghost" size="sm" onPress={() => setProfile({ avatarUri: null })} /> : null}
        </View>
      </View>

      <Card style={styles.card}>
        <TextField label="Display name" placeholder="Your name" value={profile.displayName} onChangeText={(displayName) => setProfile({ displayName })} maxLength={30} autoCorrect={false} />
        <TextField
          label="Username"
          prefix="@"
          placeholder="username"
          value={profile.username}
          onChangeText={(username) => setProfile({ username: username.replace(/^@+/, '') })}
          maxLength={30}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextField label="Bio" placeholder="Something short and catchy" value={profile.bio} onChangeText={(bio) => setProfile({ bio })} maxLength={80} multiline helper={`${profile.bio.length}/80`} />
      </Card>

      <SectionHeader title="Badge & stats" />
      <Card style={styles.card}>
        <ToggleRow label="Verified badge" description="The blue check next to your name" emoji="✅" value={profile.verified} onValueChange={(verified) => setProfile({ verified })} />
        <ToggleRow
          label="Automatic stats"
          description={`Scale with your viewers · ${formatCompact(auto.followers)} followers, ${formatCompact(auto.likes)} likes`}
          emoji="📊"
          value={profile.autoStats}
          onValueChange={(autoStats) => setProfile(autoStats ? { autoStats } : { autoStats, followers: profile.followers || auto.followers, likes: profile.likes || auto.likes })}
          last
        />
        {!profile.autoStats ? (
          <View style={styles.statFields}>
            <NumberField label="Followers" value={profile.followers} onCommit={(followers) => setProfile({ followers })} />
            <NumberField label="Likes" value={profile.likes} onCommit={(likes) => setProfile({ likes })} />
            <NumberField label="Following" value={profile.following} onCommit={(following) => setProfile({ following })} />
          </View>
        ) : null}
      </Card>
    </Screen>
  );
}

function NumberField({ label, value, onCommit }: { label: string; value: number; onCommit: (n: number) => void }) {
  const [text, setText] = useState(String(value));
  const [error, setError] = useState<string | undefined>();
  return (
    <TextField
      label={label}
      value={text}
      error={error}
      autoCapitalize="none"
      autoCorrect={false}
      placeholder="e.g. 250k"
      onChangeText={(t) => {
        setText(t);
        const n = parseLooseNumber(t);
        if (Number.isNaN(n)) {
          setError(VIEWERS_HELP);
        } else {
          setError(undefined);
          onCommit(n);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  avatarBlock: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.lg },
  avatarActions: { flexDirection: 'row', gap: Spacing.sm },
  card: { gap: Spacing.lg, marginBottom: Spacing.xl },
  statFields: { gap: Spacing.lg, paddingTop: Spacing.sm },
});
