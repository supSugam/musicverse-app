import React, { useEffect } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface IAnimatedTouchableProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  children?: React.ReactNode;
  duration?: number;
  onPressAnimation?: {
    scale: number;
    duration: number;
  };
  onPressOutAnimation?: {
    scale: number;
    duration: number;
  };
  wrapperStyles?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  wrapperClassName?: string;
  disableInitialAnimation?: boolean;
}

const AnimatedTouchable = ({
  children,
  duration = 200,
  onPressAnimation = {
    scale: 0.95,
    duration: 500,
  },
  onPressOutAnimation = {
    scale: 1,
    duration: 250,
  },
  wrapperStyles = {},
  wrapperClassName = '',
  disableInitialAnimation = false,
  ...rest
}: IAnimatedTouchableProps) => {
  const translateX = useSharedValue(disableInitialAnimation ? 0 : 50); // Start position outside the screen
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    translateX.value = withTiming(0, { duration });
  }, [duration]);

  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const leaveAnimation = () => {
    scale.value = withTiming(onPressOutAnimation.scale, {
      duration: onPressOutAnimation.duration,
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() =>
        (scale.value = withTiming(onPressAnimation.scale, {
          duration: onPressAnimation.duration,
        }))
      }
      onPressOut={leaveAnimation}
      {...rest}
    >
      <Animated.View
        style={[scaleStyle, translateStyle, wrapperStyles]}
        className={wrapperClassName}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedTouchable;
