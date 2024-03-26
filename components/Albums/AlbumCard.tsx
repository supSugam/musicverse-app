import { View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IGenre } from '@/utils/Interfaces/IGenre';
import { Image } from 'expo-image';
import { TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  Circle,
  Defs,
  LinearGradient,
  Rect,
  Stop,
  Svg,
} from 'react-native-svg';

interface IAlbumCardProps {
  id: string;
  cover: string | null;
  title: string;
  subtitle: string;
  genre?: IGenre;
  onPlayClick?: () => void;
  onOptionsClick?: () => void;
}

const AlbumCard = ({
  cover,
  title,
  subtitle,
  genre,
  id,
  onPlayClick,
  onOptionsClick,
}: IAlbumCardProps) => {
  const [cardWidth, setCardWidth] = useState<number>(0);
  const { queueId, isPlaying } = usePlayerStore();
  const [isThisQueuePlaying, setIsThisQueuePlaying] = useState<boolean>(false);

  useEffect(() => {
    setIsThisQueuePlaying(queueId === id && isPlaying);
  }, [queueId]);

  const playButtonOpacity = useSharedValue(1);
  const playButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: playButtonOpacity.value,
    };
  });

  useEffect(() => {
    if (isThisQueuePlaying) {
      const pulseAnimation = withRepeat(
        withTiming(0.8, {
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

  const { playPause } = usePlayerStore();
  return (
    <View
      className="flex flex-col w-48 h-48 bg-gray-800 mr-5"
      style={{
        borderRadius: 6,
        overflow: 'hidden',
        borderColor: COLORS.neutral.semidark,
        borderWidth: 1,
      }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width);
      }}
    >
      <View
        className="relative"
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { alignItems: 'center', justifyContent: 'center', zIndex: 1 },
          ]}
        >
          <Svg
            height="100%"
            width="100%"
            viewBox={`0 0 ${cardWidth} ${cardWidth}`}
          >
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="rgb(0,0,0)" stopOpacity="0.3" />
                <Stop offset="0.5" stopColor="rgb(0,0,0)" stopOpacity="0.3" />
                <Stop offset="0.8" stopColor="rgb(0,0,0)" stopOpacity="0.85" />
                <Stop offset="1" stopColor="rgb(0,0,0)" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={cardWidth}
              height={cardWidth}
              fill="url(#grad)"
            />
          </Svg>
        </View>

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
          containerStyle={{
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
    </View>
  );
};

export default AlbumCard;
