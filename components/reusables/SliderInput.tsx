import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import COLORS from '@/constants/Colors';
import { calculatePercentage } from '@/utils/helpers/number';
import { LinearGradient } from 'expo-linear-gradient';

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
  const sliderDotPositionValue = useSharedValue(0);
  const progressValue = useSharedValue(0);

  //   const onGestureEvent = useAnimatedGestureHandler({
  //     onStart: (_, context) => {
  //       context.startX = sliderDotTranslateX.value;
  //     },
  //     onActive: (event, context) => {
  //       let newValue = (context.startX as number) + event.translationX;
  //       //   newValue = Math.max(0, Math.min(newValue, width - 40)); // Adjust the maximum translationX value here
  //       sliderDotTranslateX.value = newValue;
  //     },
  //     onEnd: () => {
  //       //   const percentage = translateX.value / (width - 40); // Adjust the maximum translationX value here
  //       //   const newValue =
  //       //     minimumValue + percentage * (maximumValue - minimumValue);
  //       //   translateX.value = withSpring(percentage * (width - 40)); // Adjust the maximum translationX value here
  //       //   onValueChange?.(newValue);
  //     },
  //   });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      left: `${sliderDotPositionValue.value}%`,
    };
  });

  const sliderDotAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: allowChange ? 1 : 0,
      left: `${sliderDotPositionValue.value}%`,
    };
  });
  useEffect(() => {
    const percentage = calculatePercentage(currentValue, maximumValue);
    progressValue.value = withSpring(percentage, {
      duration: 1000, // Duration of the animation in milliseconds
      stiffness: 100, // Controls the stiffness of the spring animation
      overshootClamping: false, // Determines if the spring animation should overshoot and then settle
      restDisplacementThreshold: 0.01, // Threshold for considering the animation at rest
      restSpeedThreshold: 0.01, // Threshold for considering the animation at rest
    });
    sliderDotPositionValue.value = withSpring(percentage);
    console.log('sliderDotTranslateX.value', sliderDotPositionValue.value);
  }, [currentValue, maximumValue]);

  // Animated styles for the progress bar
  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));
  const trackHeightStyle = {
    height: trackHeight,
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={[styles.sliderDot, sliderDotAnimatedStyle]} />

      <PanGestureHandler>
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
      </PanGestureHandler>
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
