import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Palette, Type, type TypeVariant } from '@/constants/theme';
import { formatCompact } from '@/utils/format';

export interface NumberTickerProps {
  value: number;
  format?: (n: number) => string;
  variant?: TypeVariant;
  color?: string;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/** A number whose digits roll like an odometer when the value changes. */
export function NumberTicker({ value, format = formatCompact, variant = 'smallBold', color = Palette.white }: NumberTickerProps) {
  const text = format(value);
  const { fontSize, lineHeight } = Type[variant];
  const digitWidth = Math.ceil(fontSize * 0.62);
  const textStyle = [Type[variant], { color, fontVariant: ['tabular-nums'] as const }];

  return (
    <View style={styles.row} accessibilityLabel={text} accessible>
      {text.split('').map((ch, i) =>
        /\d/.test(ch) ? (
          <Digit key={`${i}-${text.length}`} digit={Number(ch)} height={lineHeight} width={digitWidth} textStyle={textStyle} />
        ) : (
          <Text key={`${i}-${text.length}-${ch}`} style={textStyle}>
            {ch}
          </Text>
        ),
      )}
    </View>
  );
}

function Digit({
  digit,
  height,
  width,
  textStyle,
}: {
  digit: number;
  height: number;
  width: number;
  textStyle: React.ComponentProps<typeof Text>['style'];
}) {
  const y = useSharedValue(-digit * height);

  useEffect(() => {
    y.value = withTiming(-digit * height, { duration: 480, easing: Easing.out(Easing.cubic) });
  }, [digit, height, y]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  return (
    <View style={{ height, width, overflow: 'hidden' }}>
      <Animated.View style={style}>
        {DIGITS.map((d) => (
          <Text key={d} style={[textStyle, { height, lineHeight: height, textAlign: 'center' }]}>
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
