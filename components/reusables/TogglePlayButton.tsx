import React, { useState } from 'react';
import AnimatedTouchable from './AnimatedTouchable';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ITogglePlayButtonProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  size?: number;
  isPlaying?: boolean;
}

const TogglePlayButton = ({
  size = 24,
  isPlaying = false,
  ...rest
}: ITogglePlayButtonProps) => {
  const { style, onPress, ...others } = rest;
  const [iconName, setIconName] = useState<'pause' | 'play-arrow'>(
    isPlaying ? 'pause' : 'play-arrow'
  );
  const iconAnimation = useSharedValue(0);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${iconAnimation.value}deg` }],
    };
  });

  return (
    <AnimatedTouchable
      activeOpacity={0.9}
      onPressAnimation={{ scale: 0.95, duration: 100 }}
      onPressOutAnimation={{ scale: 1, duration: 100 }}
      wrapperStyles={[
        {
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
        },
        style,
      ]}
      onPress={() => {
        setIconName((prev) => (prev === 'play-arrow' ? 'pause' : 'play-arrow'));
        iconAnimation.value = withTiming(iconAnimation.value === 0 ? 360 : 0, {
          duration: 500,
        });
        onPress?.();
      }}
      {...others}
    >
      <Animated.View style={iconAnimatedStyle}>
        <MaterialIcons
          name={iconName}
          size={size}
          color={COLORS.neutral.dense}
        />
      </Animated.View>
    </AnimatedTouchable>
  );
};

export default TogglePlayButton;
