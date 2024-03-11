import { calculatePercentage } from '@/utils/helpers/number';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface IHorizontalMarqueeProps {
  speed?: number;
  pauseDuration?: number;
  children: React.ReactNode;
}

const HorizontalMarquee: React.FC<IHorizontalMarqueeProps> = ({
  speed = 5000,
  pauseDuration = 2000,
  children,
}) => {
  const translateXContent = useSharedValue(0);
  const followTranslateXContent = useSharedValue(0);
  const contentWidth = useRef<number>(0);
  const containerWidth = useRef<number>(0);

  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const [widthDiff, setWidthDiff] = useState<number>(0);

  useEffect(() => {
    const percentage = calculatePercentage(
      contentWidth.current,
      containerWidth.current
    );
    const shouldAnimate = percentage > 80;
    const diff = contentWidth.current - containerWidth.current;

    setShouldAnimate(shouldAnimate);
    setWidthDiff(diff);
  }, [containerWidth.current, contentWidth.current]);

  useEffect(() => {
    if (!shouldAnimate) return;

    const animate = withRepeat(
      withSequence(
        withTiming(-contentWidth.current + widthDiff, {
          duration: speed,
          easing: Easing.linear,
        }),
        withTiming(0, { duration: 0 }),
        withTiming(0, { duration: pauseDuration })
      ),
      -1,
      true
    );

    translateXContent.value = animate;
    followTranslateXContent.value = animate;
  }, [speed, pauseDuration, shouldAnimate, widthDiff]);

  const contentAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXContent.value }],
    };
  });

  const followContentAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: followTranslateXContent.value - widthDiff }],
    };
  });

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width: layoutWidth } = event.nativeEvent.layout;
        containerWidth.current = layoutWidth;
      }}
    >
      <Animated.View
        style={[styles.content, contentAnimatedStyles]}
        onLayout={(event) => {
          const { width: layoutWidth } = event.nativeEvent.layout;
          contentWidth.current = layoutWidth;
        }}
      >
        {children}
      </Animated.View>

      {shouldAnimate && (
        <Animated.View style={[styles.content, followContentAnimatedStyles]}>
          {children}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    maxWidth: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    maxWidth: '100%',
  },
});

export default HorizontalMarquee;
