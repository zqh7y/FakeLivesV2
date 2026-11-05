import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { IconButton } from '@/components/icon-button';
import { Palette, Sizes, Spacing } from '@/constants/theme';

export interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  right?: React.ReactNode;
}

/** Header for modal pages: a grabber, the title, and a close button. */
export function ModalHeader({ title, onClose, right }: ModalHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.grabber} />
      <View style={styles.row}>
        <IconButton icon="close" label="Close" onPress={onClose} size={Sizes.touchSm} iconSize={20} />
        <AppText variant="h3" style={styles.title} numberOfLines={1}>
          {title}
        </AppText>
        <View style={styles.rightSlot}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.sm },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.borderStrong,
    marginBottom: Spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  title: { flex: 1, textAlign: 'center' },
  rightSlot: { width: Sizes.touchSm, alignItems: 'flex-end' },
});
