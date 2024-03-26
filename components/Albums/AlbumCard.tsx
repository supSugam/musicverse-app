import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IGenre } from '@/utils/Interfaces/IGenre';
import DarkGradient from '../Playlist/DarkGradient';
import { Image } from 'expo-image';
import { TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface IAlbumCard {
  id: string;
  cover: string | null;
  title: string;
  subtitle: string;
  genre?: IGenre;
  onPlayClick?: () => void;
}

const AlbumCard = ({
  cover,
  title,
  subtitle,
  genre,
  id,
  onPlayClick,
}: IAlbumCard) => {
  const [cardWidth, setCardWidth] = useState<number>(0);
  const { queueId } = usePlayerStore();
  const isThisQueuePlaying = queueId === id;

  const playButtonOpacity = useSharedValue(1);
  const playButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: playButtonOpacity.value,
    };
  });

  useEffect(() => {
    if (isThisQueuePlaying) {
      const pulseAnimation = withRepeat(
        withTiming(0, {
          duration: 1000,
        }),
        -1,
        true
      );
      playButtonOpacity.value = pulseAnimation;
    } else {
      playButtonOpacity.value = withTiming(1);
    }
  }, [isThisQueuePlaying]);

  return (
    <View
      className="flex flex-col w-[50%]"
      onLayout={(event) => {
        setCardWidth(event.nativeEvent.layout.width);
      }}
    >
      <View
        className="w-full relative"
        style={{
          height: cardWidth,
        }}
      >
        <Image
          source={cover ? { uri: cover } : TRACK_PLACEHOLDER_IMAGE}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        {/* Play Pause */}
        <Animated.View
          className="w-full h-full top-0 left-0 flex justify-center items-center absolute"
          style={playButtonAnimatedStyle}
        >
          <TouchableOpacity activeOpacity={0.7} onPress={onPlayClick}>
            <Ionicons
              name={isThisQueuePlaying ? 'pause' : 'play'}
              size={28}
              color={'white'}
            />
          </TouchableOpacity>
        </Animated.View>

        <View className="w-full flex flex-row justify-between items-end absolute bottom-0 p-2">
          <View className="flex flex-col">
            <StyledText size="lg" ellipsizeMode="tail" numberOfLines={1}>
              {title}
            </StyledText>
            <StyledText
              size="base"
              opacity="high"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {subtitle}
            </StyledText>
          </View>

          {/* TODO: genre based search on click */}
          <View
            className="rounded-full py-1 px-3"
            style={{
              backgroundColor: COLORS.neutral.dense,
            }}
          >
            <StyledText size="base" opacity="high">
              {genre?.name}
            </StyledText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AlbumCard;
