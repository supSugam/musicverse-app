import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
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
  const width = useRef(0);

  useEffect(() => {
    translateXContent.value = withRepeat(
      withSequence(
        withTiming(-width.current, {
          duration: speed,
          easing: Easing.linear,
        }),
        withTiming(0, {
          duration: 0,
        }),
        withTiming(0, {
          duration: pauseDuration,
        })
      ),
      -1,
      true
    );

    followTranslateXContent.value = withRepeat(
      withSequence(
        withTiming(-width.current, {
          duration: speed,
          easing: Easing.linear,
        }),
        withTiming(0, {
          duration: 0,
        }),
        withTiming(0, {
          duration: pauseDuration,
        })
      ),
      -1,
      true
    );
  }, [width.current, pauseDuration, speed]);

  const contentAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXContent.value }],
    };
  });

  const followContentAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: followTranslateXContent.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.content, contentAnimatedStyles]}
        onLayout={(event) => {
          const { width: layoutWidth } = event.nativeEvent.layout;
          width.current = layoutWidth;
        }}
      >
        {children}
      </Animated.View>

      <Animated.View
        style={[styles.content, followContentAnimatedStyles]}
        onLayout={(event) => {
          const { width: layoutWidth } = event.nativeEvent.layout;
          width.current = layoutWidth;
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    maxWidth: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '100%',
  },
});

export default HorizontalMarquee;
