import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import StyledText from '../reusables/StyledText';
import ImageDisplay from '../reusables/ImageDisplay';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';

interface ITrackListItemProps {
  id: string;
  title: string;
  artistName?: string;
  artistId?: string;
  cover: string | null;
  duration: number;
  onPlayClick?: () => void;
  isPlaying?: boolean;
  isLiked?: boolean;
  label?: string | number;
}

const TrackListItem = ({
  id,
  title,
  artistName,
  artistId,
  cover,
  duration,
  label,
  isLiked = false,
  onPlayClick,
  isPlaying,
}: ITrackListItemProps) => {
  const translateX = useSharedValue(400); // Start position outside the screen

  // Favorite button animations
  const favoriteButtonScale = useSharedValue(1);

  const [isFavorite, setIsFavorite] = useState<boolean>(isLiked);

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const favoriteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteButtonScale.value }],
  }));

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 400 });
  }, []);

  const leaveAnimation = () => {
    favoriteButtonScale.value = withTiming(1, { duration: 250 });
  };

  // API

  const {
    toggleLike: { mutate, isPending },
  } = useTracksQuery({ id });

  const onLikeClick = () => {
    if (isPending) return;
    mutate(id);
    setIsFavorite((prev) => !prev);
  };
  return (
    <Animated.View
      style={[
        translateStyle,
        {
          zIndex: 1,
          height: 65,
          // backgroundColor: 'red',
        },
      ]}
      className="flex flex-row items-center my-2 flex-1"
    >
      <LinearGradient
        colors={[
          COLORS.primary.light,
          ...COLORS.gradient.primary,
          COLORS.primary.dark,
        ]}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: -1,
          opacity: 0.1,
          padding: 4,
          flex: 1,
          top: 0,
          left: 0,
          borderRadius: 8,
        }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      />
      <View className="flex flex-row items-center flex-1 px-2">
        {label !== undefined && (
          <StyledText
            size="sm"
            weight="semibold"
            style={{
              color: COLORS.neutral.normal,
            }}
            className="mx-2"
          >
            {label}
          </StyledText>
        )}
        <ImageDisplay
          source={cover ? { uri: cover } : TRACK_PLACEHOLDER_IMAGE}
          placeholder={''}
          width={45}
          height={45}
          borderRadius={4}
          style={{
            borderColor: COLORS.neutral.semidark,
            borderWidth: 1,
          }}
          className="ml-2"
        />

        <View className="flex flex-col mx-3 mr-5 flex-1">
          <StyledText
            size="base"
            weight="semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}asasasasasasasasasasasaaaa
          </StyledText>
          <StyledText
            size="sm"
            weight="light"
            dimness="extra"
            style={{
              color: COLORS.neutral.light,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {artistName}
          </StyledText>
        </View>
        <View className="flex flex-row items-center ml-auto justify-end">
          <TouchableOpacity
            className="mr-2"
            onPress={onPlayClick}
            activeOpacity={0.8}
            style={{
              transform: [{ scale: 1.2 }],
            }}
          >
            <MaterialIcons
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={28}
              color={COLORS.neutral.light}
            />
          </TouchableOpacity>
          <MaterialIcons
            name="more-vert"
            size={24}
            color={COLORS.neutral.light}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default TrackListItem;

{
  /* <LottieView
source={PlayingMusicLA}
autoPlay
loop
speed={0.8}
style={{
  alignSelf: 'center',
  transform: [{ scaleX: 5 }, { scaleY: 5 }],
  width: 42,
  height: 42,
}}
/> */
}
