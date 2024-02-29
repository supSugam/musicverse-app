import React from 'react';
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

interface ISliderInputProps {
  minimumValue: number;
  maximumValue: number;
  currentValue: number;
  onValueChange?: (value: number) => void;
  showDot?: boolean;
  width?: number; // Width of the slider container
}

const SliderInput = ({
  minimumValue,
  maximumValue,
  currentValue,
  onValueChange,
  showDot = false,
  width = Dimensions.get('window').width, // Default to window width if not provided
}: ISliderInputProps) => {
  const translateX = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      let newValue = (context.startX as number) + event.translationX;
      newValue = Math.max(0, Math.min(newValue, width - 40)); // Adjust the maximum translationX value here
      translateX.value = newValue;
    },
    onEnd: () => {
      const percentage = translateX.value / (width - 40); // Adjust the maximum translationX value here
      const newValue =
        minimumValue + percentage * (maximumValue - minimumValue);
      translateX.value = withSpring(percentage * (width - 40)); // Adjust the maximum translationX value here
      onValueChange?.(newValue);
    },
  });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const dotStyle = useAnimatedStyle(() => {
    return {
      opacity: showDot ? 1 : 0,
      transform: [{ translateX: translateX.value - 10 }], // Adjust the dot position
    };
  });

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={[styles.sliderContainer, { width: width }]}>
          <View style={styles.track} />
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View style={[styles.slider, sliderStyle]}>
              {showDot && <Animated.View style={[styles.dot, dotStyle]} />}
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'red',
  },

  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  sliderContainer: {
    height: 4, // Adjust the height of the slider container here
    borderRadius: 2, // Adjust the border radius of the slider container here
    backgroundColor: '#282828',
    overflow: 'hidden',
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#535353',
    borderRadius: 2, // Adjust the border radius of the track here
  },
  slider: {
    width: 12, // Adjust the width of the slider knob here
    height: 12, // Adjust the height of the slider knob here
    borderRadius: 6, // Adjust the border radius of the slider knob here
    backgroundColor: '#1ED760', // Adjust the color of the slider knob here
    position: 'relative',
    zIndex: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1ED760', // Adjust the color of the dot here
    position: 'absolute',
    top: 4,
    zIndex: 2,
  },
});

export default SliderInput;
