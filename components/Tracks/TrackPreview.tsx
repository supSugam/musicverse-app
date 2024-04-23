import { View } from 'react-native';
import React, { useEffect } from 'react';
import StyledText from '../reusables/StyledText';
import ImageDisplay from '../reusables/ImageDisplay';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import { formatDuration } from '@/utils/helpers/string';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import { PlayingMusicLA } from '@/assets/lottie';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import HorizontalMarquee from '../reusables/HorizontalMarquee';

interface ITrackPreviewProps
  extends React.ComponentProps<typeof AnimatedTouchable> {
  id?: string;
  title?: string;
  artistName?: string;
  cover?: string | null;
  duration?: number;
  onPlayClick?: () => void;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  index?: number;
}

const TrackPreview = ({
  id,
  title,
  artistName,
  cover,
  duration,
  rightComponent,
  onPlayClick,
  onPress,
  index,
  ...props
}: ITrackPreviewProps) => {
  const { className, style } = props;
  const translateX = useSharedValue(100);

  const { currentTrack, isPlaying } = usePlayerStore((state) => state);
  const IsPlaying = currentTrack?.()?.id === id && isPlaying;

  useEffect(() => {
    translateX.value = withSpring(0, {
      dampingRatio: 0.8,
      duration: ((index ?? 0) + 1) * 200,
    });
  }, [duration, index]);

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <AnimatedTouchable onPress={onPress} {...props}>
      <Animated.View
        style={[
          translateStyle,
          {
            zIndex: 1,
            paddingVertical: 8,
          },
          style,
        ]}
        className={`flex flex-row items-center my-1 w-full ${className}`}
      >
        <View className="flex flex-row items-center flex-1 px-2">
          <View
            style={{
              width: 60,
              height: 60,
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              borderRadius: 4,
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                justifyContent: 'center',
                alignItems: 'center',

                backgroundColor: IsPlaying
                  ? `rgba(0,0,0,0.7)`
                  : `rgba(0,0,0,0.3)`,
              }}
            />
            <LottieView
              source={PlayingMusicLA}
              autoPlay={IsPlaying}
              loop
              style={{
                width: 60,
                height: 60,
                transform: [{ scale: 3 }],
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: IsPlaying ? 1 : -1,
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
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
              }}
            />
          </View>

          <View className="flex flex-col mx-4 mr-5 flex-1">
            <HorizontalMarquee>
              <StyledText
                size="base"
                weight="semibold"
                numberOfLines={1}
                ellipsizeMode="tail"
                className="leading-7"
              >
                {title}
              </StyledText>
            </HorizontalMarquee>

            <StyledText
              size="sm"
              weight="light"
              style={{
                color: COLORS.neutral.light,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {artistName} &nbsp;•&nbsp; {formatDuration(duration, true)}
            </StyledText>
          </View>
          <View className="flex flex-row items-center ml-auto justify-end">
            {rightComponent}
          </View>
        </View>
      </Animated.View>
    </AnimatedTouchable>
  );
};

export default TrackPreview;
