import React, { useEffect, useState } from 'react';
import AnimatedTouchable from './AnimatedTouchable';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface IPlayButtonProps {
  size?: number;
  isPlaying?: boolean;
  onPress?: () => void;
}

const PlayButon = ({
  size = 24,
  isPlaying = false,
  onPress,
}: IPlayButtonProps) => {
  const iconAnimation = useSharedValue(0);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    iconAnimation.value = withTiming(isPlaying ? 180 : 0, {
      duration: 300,
    });
    return {
      transform: [{ rotate: `${iconAnimation.value}deg` }],
    };
  }, [isPlaying]);

  useEffect(() => {
    console.log('isPlaying', isPlaying);
  }, [isPlaying]);
  return (
    <AnimatedTouchable
      activeOpacity={0.9}
      onPressAnimation={{ scale: 0.95, duration: 200 }}
      onPressOutAnimation={{ scale: 1, duration: 200 }}
      wrapperStyles={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: size * 1.5,
        height: size * 1.5,
        borderRadius: size,
        backgroundColor: COLORS.neutral.light,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Animated.View style={iconAnimatedStyle}>
        <MaterialIcons
          name={isPlaying ? 'pause' : 'play-arrow'}
          size={size}
          color={COLORS.neutral.dense}
        />
      </Animated.View>
    </AnimatedTouchable>
  );
};

export default PlayButon;
