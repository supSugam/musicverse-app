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
import SliderInput from '../reusables/SliderInput';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const TrackPlayer = () => {
  // Player Store
  const {
    currentTrack,
    setPlayerExpanded,
    isPlayerExpanded,
    playbackPosition,

    seek,
  } = usePlayerStore();

  const track = currentTrack();

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
          <TouchableOpacity activeOpacity={0.7} onPress={onPlayerClose}>
            <Ionicons
              name="chevron-down"
              size={28}
              color={COLORS.neutral.light}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <MaterialIcons
              name="more-vert"
              size={28}
              color={COLORS.neutral.light}
            />
          </TouchableOpacity>
        </View>
        <View className="flex flex-col">
          <TouchableOpacity activeOpacity={0.7} className="mt-8 mx-2">
            <ImageDisplay
              source={
                track?.cover ? { uri: track?.cover } : TRACK_PLACEHOLDER_IMAGE
              }
              placeholder=""
              width={'100%'}
              height={328}
              borderRadius={8}
            />
          </TouchableOpacity>

          <View className="flex flex-col mt-6 mx-3">
            <Link
              href={`//(tabs)/profile/${track?.creator?.username}` as never}
            >
              <StyledText
                size="sm"
                weight="light"
                dimness="extra"
                className="leading-6"
              >
                {track?.creator?.profile.name}
              </StyledText>
            </Link>
            <StyledText size="2xl" weight="bold" dimness="low">
              {track?.title}
            </StyledText>
          </View>

          <View className="m-3">
            <GestureHandlerRootView style={{ width: '100%' }}>
              <SliderInput
                currentValue={playbackPosition}
                minimumValue={0}
                maximumValue={track?.trackDuration || 0}
                allowChange
                onValueChange={seek}
                roundedTrack
                showDot
                trackHeight={4}
                color="white"
                key={`${track?.id}-SliderInPlayer`}
              />
            </GestureHandlerRootView>
          </View>
        </View>
      </Animated.View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.dense,
    padding: 16,
    width: '100%',
    minHeight: '100%',
  },

  trackInfoWrapper: {
    padding: 12,
  },
});

export default TrackPlayer;
