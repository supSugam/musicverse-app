import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import ImageDisplay from '../reusables/ImageDisplay';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';

interface IArtistCardProps {
  id: string;
  avatar?: string | null;
  name: string;
  followers?: number;
  index: number;
}

const ArtistCard = ({
  id,
  avatar,
  name,
  followers = 0,
  index,
}: IArtistCardProps) => {
  const translateX = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const artistCardAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    translateX.value = withDelay(100 * index, withTiming(0, { duration: 500 }));
    opacity.value = withDelay(100 * index, withTiming(1, { duration: 500 }));
  }, [index]);

  const navigation = useNavigation();
  const onPress = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ArtistPage',
        params: {
          artistId: id,
        },
      })
    );
  };
  return (
    <AnimatedTouchable onPress={onPress}>
      <Animated.View
        className="flex flex-col items-center mr-4"
        style={artistCardAnimatedStyles}
      >
        <ImageDisplay
          source={avatar}
          width={60}
          height={60}
          borderRadius="full"
        />
        <View className="flex flex-col items-center justify-center">
          <StyledText
            color={COLORS.neutral.light}
            size="sm"
            weight="semibold"
            className="mt-2"
          >
            {name}
          </StyledText>
          <StyledText
            color={COLORS.neutral.light}
            size="xs"
            weight="extralight"
            opacity="high"
          >
            {`${followers} ${followers === 1 ? 'follower' : 'followers'}`}
          </StyledText>
        </View>
      </Animated.View>
    </AnimatedTouchable>
  );
};

export default ArtistCard;
