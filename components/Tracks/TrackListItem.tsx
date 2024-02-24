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

interface ITrackListItemProps {
  id: string;
  title: string;
  artistName?: string;
  artistId?: string;
  cover: string | null;
  duration: number;
  onPlayClick?: () => void;
  isPlaying?: boolean;
}
const TRACK_PLACEHOLDER_IMAGE = require('@/assets/images/placeholder/track.jpg');

const TrackListItem = ({
  id,
  title,
  artistName,
  artistId,
  cover,
  duration,
  onPlayClick,
  isPlaying,
}: ITrackListItemProps) => {
  const translateX = useSharedValue(500); // Start position outside the screen

  // Favorite button animations
  const favoriteButtonScale = useSharedValue(1);

  const [isFavorite, setIsFavorite] = useState(false);

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const favoriteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteButtonScale.value }],
  }));

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 500 });
  }, []);

  const leaveAnimation = () => {
    favoriteButtonScale.value = withTiming(1, { duration: 250 });
  };

  return (
    <Animated.View
      style={[
        translateStyle,
        {
          zIndex: 1,
          height: 70,
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
      <View className="flex flex-row items-center px-2">
        <TouchableOpacity onPress={onPlayClick} activeOpacity={0.8}>
          <MaterialIcons
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={28}
            color={COLORS.neutral.light}
          />
        </TouchableOpacity>

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
          className="ml-4"
        />

        <View className="flex flex-1 flex-col ml-3">
          <StyledText
            size="base"
            weight="semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
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
        <View className="flex flex-row items-center ml-3 flex-1 justify-end">
          <Pressable
            onPressIn={() => {
              setIsFavorite(!isFavorite);

              favoriteButtonScale.value = withSpring(1.1, {
                stiffness: 1000,
                damping: 10,
              });
            }}
            onPressOut={leaveAnimation}
          >
            <Animated.View style={favoriteButtonStyle}>
              <FontAwesome
                name={isFavorite ? 'heart' : 'heart-o'}
                size={26}
                color={isFavorite ? COLORS.neutral.white : COLORS.neutral.light}
                className="mr-3"
                style={{
                  marginRight: 16,
                }}
              />
            </Animated.View>
          </Pressable>
          <MaterialIcons
            name="more-vert"
            size={24}
            color={COLORS.neutral.light}
            className="ml-3"
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
