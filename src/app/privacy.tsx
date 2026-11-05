import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { ModalHeader } from '@/components/modal-header';
import { Screen } from '@/components/screen';
import { Spacing } from '@/constants/theme';

const sections: { title: string; body: string }[] = [
  {
    title: 'What FakeLives is',
    body: 'FakeLives is an entertainment app. It shows your camera with a made-up viewer count and a chat full of people who do not exist. Nothing you see in the chat is real, and nothing is broadcast anywhere.',
  },
  {
    title: 'Camera',
    body: 'The camera is used only to show a live preview on your own screen. FakeLives never records video, never takes pictures, and never sends camera data off your device.',
  },
  {
    title: 'Microphone and voice',
    body: 'If you turn on “Viewers hear you”, the app listens through the microphone and turns your speech into text so the chat can react to it. That recognition is done by your phone’s own speech service (Apple or Google), which may process audio on their servers depending on your device and language settings. FakeLives itself keeps no recordings and no transcripts. Leave the option off and the microphone is never used.',
  },
  {
    title: 'Photos',
    body: 'If you choose a profile picture, the app keeps a reference to that photo on your device so it can show it in the app. It is not uploaded.',
  },
  {
    title: 'Your settings',
    body: 'Your name, username, bio, picture, platform look, viewer count, chat preferences, custom comments, camera filter, mirroring choice and your last live summary are saved on your device only. Deleting the app deletes them.',
  },
  {
    title: 'No accounts, no tracking',
    body: 'FakeLives has no accounts, no analytics, no advertising SDKs and no servers of its own. Apart from your phone’s speech service when voice is on, it makes no network requests.',
  },
  {
    title: 'Be kind',
    body: 'Use it for pranks, videos and fun. Do not use it to deceive people in ways that could hurt them, and do not pass fake numbers off as real to anyone who relies on them. The platform looks are imitations for entertainment and are not affiliated with those companies.',
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  return (
    <Screen scroll edges={['left', 'right', 'bottom']} header={<ModalHeader title="Privacy" onClose={() => router.back()} />}>
      <View style={styles.list}>
        {sections.map((s) => (
          <View key={s.title} style={styles.section}>
            <AppText variant="h3">{s.title}</AppText>
            <AppText variant="body" color="textSecondary">
              {s.body}
            </AppText>
          </View>
        ))}
        <AppText variant="small" color="textMuted" align="center">
          Last updated November 2026
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.xl, paddingTop: Spacing.sm },
  section: { gap: Spacing.xs },
});
