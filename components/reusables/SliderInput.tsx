import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import COLORS from '@/constants/Colors';
import {
  calculatePercentage,
  getValueFromPercentage,
} from '@/utils/helpers/number';
import { LinearGradient } from 'expo-linear-gradient';

import {
  GestureDetector,
  Gesture,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { throttle } from '@/utils/helpers/throttle';

interface ISliderInputProps extends React.ComponentProps<typeof View> {
  minimumValue: number;
  maximumValue: number;
  currentValue: number;
  onValueChange?: (value: number) => void;
  allowChange?: boolean;
  showDot?: boolean;
  roundedTrack?: boolean;
  trackHeight?: number;
  color?: 'gradient' | 'white';
  paddingVertical?: number;
}

const SliderInput = ({
  minimumValue,
  maximumValue,
  currentValue,
  onValueChange,
  allowChange = false,
  showDot = false,
  roundedTrack = false,
  trackHeight = 2,
  color = 'gradient',
  paddingVertical = 0,
}: ISliderInputProps) => {
  // Pan Gesture Handler for progress seeking
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const panGestureHandler = Gesture.Pan()
    .onTouchesDown((event) => {
      const positionX = event.allTouches[0].x;
      const percentage = calculatePercentage(positionX, containerWidth);
      progressValue.value = percentage;
      sliderDotPositionValue.value = percentage;
    })
    .onChange((event) => {
      setIsSeeking(true);
      const change = event.changeX;
      console.log('change', change);
      const percentage = calculatePercentage(change, containerWidth);
      progressValue.value += percentage;
      sliderDotPositionValue.value += percentage;
    })
    .onFinalize(() => {
      setIsSeeking(false);

      const throttledFunction = throttle(() => {
        onValueChange?.(
          getValueFromPercentage(progressValue.value, maximumValue)
        );
      }, 500);
      throttledFunction(); // Call the throttled function to execute
    })
    .runOnJS(true);

  const sliderDotPositionValue = useSharedValue(0);
  const progressValue = useSharedValue(0);

  const sliderDotAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: `${sliderDotPositionValue.value - 0.1}%`,
      width: trackHeight * 2,
      height: trackHeight * 2,
      top: paddingVertical - trackHeight / 2,
    };
  });

  useEffect(() => {
    if (isSeeking) return;
    const percentage = calculatePercentage(currentValue, maximumValue);
    progressValue.value = percentage;
    sliderDotPositionValue.value = percentage;
  }, [currentValue, maximumValue]);

  // Animated styles for the progress bar
  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));
  const trackHeightStyle = {
    height: trackHeight,
  };

  return (
    <GestureDetector gesture={panGestureHandler}>
      <View
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
        style={[styles.container, { paddingVertical }]}
      >
        {showDot && (
          <Animated.View
            style={[styles.sliderDotContainer, sliderDotAnimatedStyle]}
          >
            <LinearGradient
              colors={
                color === 'gradient'
                  ? COLORS.gradient.primary
                  : [COLORS.neutral.white, COLORS.neutral.white]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.sliderDot}
            />
          </Animated.View>
        )}

        <View
          style={[
            styles.trackContainer,
            trackHeightStyle,
            roundedTrack && styles.roundedTrack,
          ]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              progressBarAnimatedStyle,
              trackHeightStyle,
            ]}
          >
            <LinearGradient
              colors={
                color === 'gradient'
                  ? COLORS.gradient.primary
                  : [COLORS.neutral.white, COLORS.neutral.white]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  progressBar: {
    overflow: 'hidden',
    position: 'relative',
  },
  trackContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: COLORS.neutral.dark,
  },
  roundedTrack: {
    borderRadius: 4,
  },
  sliderDotContainer: {
    ...StyleSheet.absoluteFillObject,
    width: 6,
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    overflow: 'hidden',
  },
  sliderDot: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default SliderInput;
// {showDot && <Animated.View style={[styles.dot, dotStyle]} />}
