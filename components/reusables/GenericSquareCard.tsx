import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import StyledText from './StyledText';
import { View } from 'react-native';
import COLORS from '@/constants/Colors';
import { ALBUM_PLACEHOLDER_IMAGE } from '@/utils/constants';
import AnimatedTouchable from './AnimatedTouchable';

interface IGenericSquareCardProps extends React.ComponentProps<typeof View> {
  index: number;
  image?: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const GenericSquareCard = ({
  index,
  image = ALBUM_PLACEHOLDER_IMAGE,
  title,
  subtitle,
  onPress,
  ...rest
}: IGenericSquareCardProps) => {
  const { style, ...restProps } = rest;
  const scaleAndOpacity = useSharedValue(0.8);
  const squareCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAndOpacity.value }],
  }));

  useEffect(() => {
    scaleAndOpacity.value = withTiming(1, { duration: 100 * (index + 1) });
  }, [index]);

  return (
    <AnimatedTouchable onPress={onPress}>
      <Animated.View
        style={[
          squareCardAnimatedStyle,
          {
            display: 'flex',
            flexDirection: 'column',
          },
          style,
        ]}
        {...restProps}
      >
        <Animated.Image
          source={{ uri: image }}
          style={{
            width: 150,
            height: 130,
            borderRadius: 6,
            marginBottom: 8,
          }}
        />

        <View className="flex flex-col w-full">
          <StyledText weight="semibold" size="sm" tracking="tighter">
            {title}
          </StyledText>
          <StyledText
            weight="normal"
            size="sm"
            color={COLORS.neutral.light}
            tracking="tighter"
          >
            {subtitle}
          </StyledText>
        </View>
      </Animated.View>
    </AnimatedTouchable>
  );
};

export default GenericSquareCard;
