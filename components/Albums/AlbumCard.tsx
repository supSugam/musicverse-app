import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { IGenre } from '@/utils/Interfaces/IGenre';
import { Image } from 'expo-image';
import { TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import FadingDarkGradient from '../Playlist/FadingDarkGradient';

interface IAlbumCardProps {
  id: string;
  cover: string | null;
  title: string;
  subtitle: string;
  genre?: IGenre;
  onPlayClick?: () => void;
  onOptionsClick?: () => void;
  isCardViewable?: boolean;
}

const AlbumCard = ({
  cover,
  title,
  subtitle,
  genre,
  id,
  onPlayClick,
  onOptionsClick,
  isCardViewable = false,
}: IAlbumCardProps) => {
  const { queueId, isPlaying } = usePlayerStore();
  const [isThisQueuePlaying, setIsThisQueuePlaying] = useState<boolean>(false);

  useEffect(() => {
    setIsThisQueuePlaying(queueId === id && isPlaying);
  }, [queueId]);

  const playButtonOpacity = useSharedValue(1);
  const albumCardScale = useSharedValue(1);

  const albumCardAnimatedStyle = useAnimatedStyle(() => {
    albumCardScale.value = withTiming(isCardViewable ? 1 : 1, {
      duration: 300,
    });

    return {
      transform: [{ scale: albumCardScale.value }],
    };
  }, [isCardViewable]);

  const playButtonAnimatedStyle = useAnimatedStyle(() => {
    console.log('isThisQueuePlaying', isThisQueuePlaying);
    playButtonOpacity.value = isThisQueuePlaying
      ? withRepeat(
          withTiming(0.8, {
            duration: 1000,
          }),
          -1,
          true
        )
      : withTiming(1);
    return {
      opacity: playButtonOpacity.value,
    };
  }, [isThisQueuePlaying]);

  const { playPause } = usePlayerStore();
  return (
    <Animated.View
      className="flex flex-col w-48 h-48 bg-gray-800 mr-5"
      style={albumCardAnimatedStyle}
    >
      <View
        className="relative"
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: COLORS.neutral.semidark,
          borderWidth: 1,
          borderRadius: 6,
        }}
      >
        <FadingDarkGradient opacity={0.65} />

        <Image
          source={cover ? { uri: cover } : TRACK_PLACEHOLDER_IMAGE}
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Options Button */}

        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
          }}
          onPress={onOptionsClick}
        >
          <MaterialIcons
            name="more-vert"
            size={24}
            color={COLORS.neutral.light}
          />
        </TouchableOpacity>

        {/* Play Pause */}
        <Animated.View
          className="absolute pb-4"
          style={[playButtonAnimatedStyle, { zIndex: 2 }]}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              if (isThisQueuePlaying) {
                playPause();
              } else {
                onPlayClick?.();
              }
            }}
          >
            <MaterialIcons
              name={
                isThisQueuePlaying
                  ? 'pause-circle-filled'
                  : 'play-circle-filled'
              }
              size={38}
              color={COLORS.neutral.light}
            />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Info */}

        <View
          className="absolute bottom-0 left-0 p-3 w-full flex flex-row justify-between items-end"
          style={{ zIndex: 2 }}
        >
          <View className="flex flex-col">
            <StyledText size="lg" ellipsizeMode="tail" numberOfLines={1}>
              {title}
            </StyledText>
            <StyledText
              size="sm"
              opacity="high"
              ellipsizeMode="tail"
              numberOfLines={1}
              weight="light"
            >
              {subtitle}
            </StyledText>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default AlbumCard;
