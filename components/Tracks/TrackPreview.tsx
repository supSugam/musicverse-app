import { Touchable, View } from 'react-native';
import React, { useEffect } from 'react';
import StyledText from '../reusables/StyledText';
import ImageDisplay from '../reusables/ImageDisplay';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import { formatDuration } from '@/utils/helpers/string';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import { PlayingMusicLA } from '@/assets/lottie';

interface ITrackPreviewProps {
  id: string;
  title: string;
  artistName?: string;
  cover: string | null;
  duration: number;
  onPlayClick?: () => void;
}

const TrackPreview = ({
  id,
  title,
  artistName,
  cover,
  duration,
}: ITrackPreviewProps) => {
  const translateX = useSharedValue(400); // Start position outside the screen

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 400 });
  }, []);

  return (
    <>
      <Animated.View
        style={[
          translateStyle,
          {
            zIndex: 1,
            height: 70,
            backgroundColor: 'red',
          },
        ]}
        className="flex flex-row items-center my-1 flex-1"
      >
        <View className="flex flex-row items-center flex-1 px-2">
          <TouchableOpacity
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <LottieView
              source={PlayingMusicLA}
              autoPlay
              loop
              speed={0.8}
              style={{
                position: 'absolute',
                width: 60,
                height: 60,
                zIndex: 2,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                opacity: 0.8,
                borderRadius: 4,
                borderColor: COLORS.neutral.semidark,
                borderWidth: 1,
              }}
            />

            <ImageDisplay
              source={cover ? { uri: cover } : TRACK_PLACEHOLDER_IMAGE}
              placeholder={''}
              width={60}
              height={60}
              borderRadius={4}
              style={{
                borderColor: COLORS.neutral.semidark,
                borderWidth: 1,
              }}
              className="ml-2"
            />
          </TouchableOpacity>

          <View className="flex flex-col mx-3 mr-5 flex-1">
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
              {artistName}&nbsp;•&nbsp;{formatDuration(duration, true)}
            </StyledText>
          </View>
          <View className="flex flex-row items-center ml-auto justify-end"></View>
        </View>
      </Animated.View>
    </>
  );
};

export default TrackPreview;

{
}
