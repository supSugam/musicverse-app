import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import COLORS from '@/constants/Colors';
import { calculatePercentage } from '@/utils/helpers/number';
import { LinearGradient } from 'expo-linear-gradient';

import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

interface ISliderInputProps {
  minimumValue: number;
  maximumValue: number;
  currentValue: number;
  onValueChange?: (value: number) => void;
  allowChange?: boolean;
  roundedTrack?: boolean;
  trackHeight?: number;
}

const SliderInput = ({
  minimumValue,
  maximumValue,
  currentValue,
  onValueChange,
  allowChange = true,
  roundedTrack = false,
  trackHeight = 2,
}: ISliderInputProps) => {
  // Pan for progress seeking
  const pan = Gesture.Pan()
    .onTouchesDown((event) => {
      console.log('onTouchesDown', event);
    })
    .onTouchesMove((event) => {
      console.log('onTouchesMove', event);
    })
    .onTouchesUp((event) => {
      console.log('onTouchesUp', event);
    })
    .onTouchesCancelled((event) => {
      console.log('onTouchesCancelled', event);
    })
    .runOnJS(true);

  pan.config = {
    minPointers: 1,
    maxPointers: 1,
    minDist: 0,
    minVelocity: 0,
    activeOffsetXStart: 0,
    activeOffsetXEnd: 0,
    shouldCancelWhenOutside: false,
  };

  const sliderDotPositionValue = useSharedValue(0);
  const progressValue = useSharedValue(0);

  const sliderDotAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: allowChange ? 1 : 0,
      left: `${sliderDotPositionValue.value}%`,
    };
  });
  useEffect(() => {
    const percentage = calculatePercentage(currentValue, maximumValue);
    progressValue.value = withTiming(percentage, {
      easing: Easing.linear,
    });
    sliderDotPositionValue.value = withTiming(percentage, {
      easing: Easing.linear,
    });
  }, [currentValue, maximumValue]);

  // Animated styles for the progress bar
  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));
  const trackHeightStyle = {
    height: trackHeight,
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pan}>
        <View style={styles.container} collapsable={false}>
          <Animated.View style={[styles.sliderDot, sliderDotAnimatedStyle]} />
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
                colors={COLORS.gradient.primary} // Using primary gradient colors for the progress bar
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
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
    backgroundColor: COLORS.neutral.semidark,
  },
  roundedTrack: {
    borderRadius: 4,
  },

  sliderDot: {
    backgroundColor: COLORS.neutral.white,
    width: 6,
    height: 6,
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    top: -2,
    zIndex: 1,
  },
});

export default SliderInput;
// {showDot && <Animated.View style={[styles.dot, dotStyle]} />}
