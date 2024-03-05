import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import COLORS from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ImageDisplay from '../reusables/ImageDisplay';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import ModalWrapper from '../reusables/ModalWrapper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import { Link } from 'expo-router';

const TrackPlayer = () => {
  // Player Store
  const { currentTrack, setPlayerExpanded, isPlayerExpanded } =
    usePlayerStore();

  const [track, setTrack] = useState<ITrackDetails | null>(currentTrack);

  const onPlayerClose = () => {
    setPlayerExpanded(false);
  };

  // Stuffs
  const { SCREEN_HEIGHT } = useScreenDimensions();

  // Animations
  const playerRootTranslateY = useSharedValue(SCREEN_HEIGHT + 50);

  const playerRootAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: playerRootTranslateY.value }],
    };
  });

  useEffect(() => {
    setTrack(currentTrack);
  }, [currentTrack]);

  useEffect(() => {
    playerRootTranslateY.value = isPlayerExpanded
      ? withTiming(0, { duration: 500 })
      : withTiming(SCREEN_HEIGHT + 50, { duration: 300 });
  }, [isPlayerExpanded]);
  return (
    <ModalWrapper
      visible={isPlayerExpanded}
      animationType="fade"
      doNotUseWrapper
      onRequestClose={onPlayerClose}
      onClose={onPlayerClose}
      position="start"
      fullWidth
    >
      <Animated.View style={[styles.container, playerRootAnimatedStyle]}>
        <View className="flex flex-row justify-between items-center mt-4">
          <TouchableOpacity activeOpacity={0.7} className="p-2">
            <Ionicons
              name="chevron-down"
              size={28}
              color={COLORS.neutral.light}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} className="p-2">
            <MaterialIcons
              name="more-vert"
              size={28}
              color={COLORS.neutral.light}
            />
          </TouchableOpacity>
        </View>
        <View className="flex flex-col">
          <TouchableOpacity activeOpacity={0.7} className="mt-4">
            <ImageDisplay
              source={
                track?.cover ? { uri: track?.cover } : TRACK_PLACEHOLDER_IMAGE
              }
              placeholder=""
              width={300}
              height={300}
              className="mt-4"
            />
          </TouchableOpacity>

          <View className="flex flex-col mt-6">
            <Link
              href={`//(tabs)/profile/${track?.creator?.username}` as never}
            >
              <StyledText
                size="sm"
                weight="light"
                dimness="extra"
                className="text-center"
              >
                {track?.creator?.username}
              </StyledText>
            </Link>
            <StyledText size="2xl" weight="bold" className="text-center">
              {track?.title}
            </StyledText>
          </View>
        </View>
      </Animated.View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.neutral.dense,
    padding: 20,
    width: '100%',
    minHeight: '100%',
  },

  trackInfoWrapper: {
    padding: 12,
  },
});

export default TrackPlayer;
