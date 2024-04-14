import { View } from 'react-native';
import React, { useEffect } from 'react';
import { IFeedContent } from '@/utils/Interfaces/IFeed';
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import ImageDisplay from '../reusables/ImageDisplay';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import { getFormattedTime } from '@/utils/helpers/date';
import FadingDarkGradient from '../Playlist/FadingDarkGradient';
import Capsule from '../reusables/Capsule';

interface IPostCardProps extends IFeedContent {
  index: number;
  onPress?: () => void;
}
const PostCard = ({
  createdAt,
  id,
  index,
  cover,
  creator,
  genre,
  onPress,
  tags,
  type,
}: IPostCardProps) => {
  const postCardPositionY = useSharedValue(-100);
  const postCardOpacity = useSharedValue(0);
  const postCardAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: postCardOpacity.value,
      transform: [{ translateY: postCardPositionY.value }],
    };
  });

  useEffect(() => {
    postCardPositionY.value = withDelay(
      100 * index,
      withTiming(0, { duration: 500 })
    );
    postCardOpacity.value = withDelay(
      100 * index,
      withTiming(1, { duration: 500 })
    );
  }, [index]);

  return (
    <Animated.View
      style={postCardAnimatedStyles}
      className="w-full flex flex-col px-5"
    >
      <View className="flex flex-row items-center mb-5">
        <ImageDisplay
          source={creator?.profile?.avatar}
          width={36}
          height={36}
          bordered
          borderRadius="full"
        />
        <View className="flex flex-col ml-3">
          <StyledText
            size="base"
            weight="semibold"
            tracking="tight"
            color={COLORS.neutral.light}
          >
            {`${creator?.profile?.name} released a new ${type}`}
          </StyledText>
          <StyledText
            size="sm"
            opacity="high"
            color={COLORS.neutral.light}
            tracking="tight"
            weight="medium"
          >
            {`${getFormattedTime(createdAt)} ago`}
          </StyledText>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={onPress}>
        <View className="relative w-full h-56 mb-8">
          {/* <FadingDarkGradient /> */}
          <ImageDisplay source={cover} width="100%" height="100%" />
          <FlatList
            horizontal
            renderItem={({ item, index }) => (
              <Capsule
                key={(item?.id as string) + index}
                text={item?.name || ''}
                selected={index === 0}
              />
            )}
            data={[genre, ...(tags ? tags : [])] || []}
            bounces
            alwaysBounceHorizontal
            contentContainerStyle={{
              maxWidth: '90%',
              position: 'absolute',
              bottom: 10,
              left: 10,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default PostCard;
