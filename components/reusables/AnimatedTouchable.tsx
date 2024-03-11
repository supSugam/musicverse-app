import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface IMenuItemProps {
  onPress: () => void;
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
}

const AnimatedTouchable = ({
  onPress,
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
}: IMenuItemProps) => {
  const translateX = useSharedValue(50); // Start position outside the screen
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  useEffect(() => {
    translateX.value = withTiming(0, { duration });
  }, []);
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
      onPress={onPress}
      onPressIn={() =>
        (scale.value = withTiming(onPressAnimation.scale, {
          duration: onPressAnimation.duration,
        }))
      }
      onPressOut={leaveAnimation}
    >
      <Animated.View style={[scaleStyle, translateStyle]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedTouchable;
