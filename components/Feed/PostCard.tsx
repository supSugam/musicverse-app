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
import { MaterialIcons } from '@expo/vector-icons';
import { useAppState } from '@/services/zustand/stores/useAppStore';

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
    console.log('index', tags);
    postCardPositionY.value = withDelay(
      100 * index,
      withTiming(0, { duration: 500 })
    );
    postCardOpacity.value = withDelay(
      100 * index,
      withTiming(1, { duration: 500 })
    );
  }, [index]);

  const { share } = useAppState();

  const onShareClick = async () => {
    share({
      url: `https://www.musicbox.com/post/${id}`,
      message: `Check out this post on MusicBox!`,
      showAppsToView: true,
      title: 'Share Post',
      type: 'url',
    });
  };

  return (
    <Animated.View
      style={[
        postCardAnimatedStyles,
        {
          backgroundColor: COLORS.neutral.dense,
          borderColor: COLORS.neutral.semidark,
          borderBottomWidth: 1,
          marginBottom: 10,
        },
      ]}
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
        <View className="flex flex-row justify-between items-center mb-4">
          <View
            className="flex flex-col"
            style={{
              maxWidth: '70%',
            }}
          >
            <View className="flex flex-row items-center">
              <TouchableOpacity activeOpacity={0.85} onPress={onShareClick}>
                <MaterialIcons
                  name="share"
                  size={24}
                  color={COLORS.neutral.normal}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                containerStyle={{
                  marginLeft: 16,
                }}
              >
                <MaterialIcons
                  name="link"
                  size={24}
                  color={COLORS.neutral.normal}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              renderItem={({ item, index }) => (
                <Capsule
                  key={(item?.id as string) + index}
                  text={item?.name || ''}
                  selected={index === 0}
                  style={{ marginRight: 8 }}
                />
              )}
              data={[genre, ...(tags ? tags : [])] || []}
              bounces
              alwaysBounceHorizontal
              contentContainerStyle={{
                alignSelf: 'flex-end',
              }}
            />
          </View>
          <View className="relative h-20 w-20">
            <FadingDarkGradient
              stops={[
                [0, 0],
                [1, 0.7],
              ]}
            />
            <ImageDisplay source={cover} width="100%" height="100%" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default PostCard;
