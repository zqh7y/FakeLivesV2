import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/app-text';
import { Fonts, Palette, Sizes } from '@/constants/theme';
import { generateAvatar } from '@/data/avatars';
import { useTheme } from '@/hooks/use-theme';
import type { GeneratedAvatar } from '@/types';

export interface AvatarProps {
  uri?: string | null;
  generated?: GeneratedAvatar;
  /** Used to generate an avatar when there is no image and no `generated`. */
  name?: string;
  size?: number;
  /** Accent ring, like a story ring. */
  ring?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** A round avatar: the user's photo, or a flat colour with initials or an emoji. */
export function Avatar({ uri, generated, name = '?', size = Sizes.avatarMd, ring, style }: AvatarProps) {
  const { accent } = useTheme();
  const gen = generated ?? generateAvatar(name);
  const ringWidth = ring ? Math.max(2, Math.round(size * 0.035)) : 0;
  const gap = ring ? ringWidth : 0;
  const inner = size - (ringWidth + gap) * 2;

  const face = uri ? (
    <Image
      source={{ uri }}
      style={{ width: inner, height: inner, borderRadius: inner / 2 }}
      contentFit="cover"
      transition={150}
      accessibilityLabel={`${name} profile picture`}
    />
  ) : (
    <View style={[styles.center, { width: inner, height: inner, borderRadius: inner / 2, backgroundColor: gen.color }]}>
      <AppText
        style={{
          fontFamily: Fonts.bold,
          fontSize: gen.emoji ? inner * 0.5 : inner * 0.38,
          lineHeight: gen.emoji ? inner * 0.62 : inner * 0.46,
          color: Palette.white,
        }}
      >
        {gen.emoji ?? gen.initials}
      </AppText>
    </View>
  );

  if (!ring) {
    return <View style={[styles.center, styles.clip, { width: size, height: size, borderRadius: size / 2 }, style]}>{face}</View>;
  }

  return (
    <View style={[styles.center, { width: size, height: size, borderRadius: size / 2, borderWidth: ringWidth, borderColor: accent.solid }, style]}>
      {face}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  clip: { overflow: 'hidden' },
});
