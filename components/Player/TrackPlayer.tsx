import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import COLORS from '@/constants/Colors';
import {
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import ImageDisplay from '../reusables/ImageDisplay';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { GLOBAL_STYLES, TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import ModalWrapper from '../reusables/ModalWrapper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import SliderInput from '../reusables/SliderInput';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { formatDuration } from '@/utils/helpers/string';
import SkipIcon from '@/lib/svgs/SkipIcon';
import { LinearGradient } from 'expo-linear-gradient';
import LoopIcon from '@/lib/svgs/LoopIcon';

const TrackPlayer = () => {
  // Player Store
  const {
    currentTrack,
    setPlayerExpanded,
    isPlayerExpanded,
    playbackPosition,
    isAsyncOperationPending,
    playPause,
    isPlaying,
    seek,
    seekForward,
    seekBackward,
    isNextTrackAvailable,
    isPrevTrackAvailable,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    isLoopingSingle,
    isLoopingQueue,
    toggleLoopStates,
    playUntilLastTrack,
    stopAfterCurrentTrack,
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

  const onPlayPause = () => {
    playPause();
  };

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
      <GestureHandlerRootView style={{ width: '100%' }}>
        <Animated.View style={[styles.rootContainer, playerRootAnimatedStyle]}>
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
              opacity: 0.15,
              flex: 1,
              top: 0,
              left: 0,
            }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.rootWrapper}>
            <View className="flex flex-row justify-between items-center mt-4">
              {/* NavBar */}
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

            {/* Track Info */}
            <View className="flex flex-col">
              <TouchableOpacity activeOpacity={0.7} className="mt-4 mx-4">
                <ImageDisplay
                  source={
                    track?.cover
                      ? { uri: track?.cover }
                      : TRACK_PLACEHOLDER_IMAGE
                  }
                  placeholder=""
                  width={'100%'}
                  height={320}
                  borderRadius={8}
                />
              </TouchableOpacity>

              <View className="flex flex-row justify-between items-center mt-6 mx-3">
                <View className="flex flex-col">
                  {/* <Link
                  href={`//(tabs)/profile/${track?.creator?.username}` as never}
                > */}
                  <StyledText
                    size="sm"
                    weight="light"
                    opacity="high"
                    className="leading-7"
                  >
                    {track?.creator?.profile.name}
                  </StyledText>
                  {/* </Link> */}
                  <StyledText size="2xl" weight="bold">
                    {track?.title}
                  </StyledText>
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                  <Ionicons
                    name="heart"
                    size={28}
                    color={COLORS.primary.light}
                  />
                </TouchableOpacity>
              </View>

              <View className="m-3 mt-6">
                {/* Main Track Progress Seekbar */}
                <SliderInput
                  currentValue={playbackPosition}
                  minimumValue={0}
                  maximumValue={track?.trackDuration || 0}
                  allowChange={!isAsyncOperationPending}
                  onValueChange={seek}
                  roundedTrack
                  showDot
                  trackHeight={4}
                  color="white"
                  key={`${track?.id}-SliderInPlayer`}
                  style={{ paddingVertical: 10 }}
                />

                {/* Track Duration Status */}
                <View className="flex flex-row justify-between items-center mt-3">
                  <StyledText
                    size="sm"
                    weight="light"
                    opacity="medium"
                    tracking="tighter"
                  >
                    {formatDuration(playbackPosition, true)}
                  </StyledText>
                  <StyledText
                    size="sm"
                    weight="light"
                    opacity="medium"
                    tracking="tighter"
                  >
                    {formatDuration(track?.trackDuration, true)}
                  </StyledText>
                </View>

                {/* Player Controls */}
                <View className="flex flex-row justify-between items-center mt-3 px-2">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => seekBackward(10)}
                  >
                    <SkipIcon skipSeconds="10s" skipType="backward" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={prevTrack}
                    style={GLOBAL_STYLES.getDisabledStyles(
                      isPrevTrackAvailable()
                    )}
                  >
                    <MaterialIcons
                      name="skip-previous"
                      color={COLORS.neutral.white}
                      size={36}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.7} onPress={onPlayPause}>
                    <MaterialIcons
                      name={
                        isPlaying ? 'pause-circle-filled' : 'play-circle-filled'
                      }
                      size={60}
                      color={COLORS.neutral.white}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={nextTrack}
                    style={GLOBAL_STYLES.getDisabledStyles(
                      isNextTrackAvailable()
                    )}
                  >
                    <MaterialIcons
                      name="skip-next"
                      color={COLORS.neutral.white}
                      size={36}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => seekForward(10)}
                  >
                    <SkipIcon skipSeconds="10s" skipType="forward" />
                  </TouchableOpacity>
                </View>

                {/* Volume Control */}
                <View className="flex flex-row items-center mt-1">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setVolume(volume > 0 ? 0 : 1)}
                    className="pr-2"
                  >
                    <MaterialIcons
                      name={volume > 0 ? 'volume-up' : 'volume-off'}
                      size={28}
                      color={COLORS.neutral.light}
                    />
                  </TouchableOpacity>
                  <View className="flex-1">
                    <SliderInput
                      currentValue={volume}
                      minimumValue={0}
                      maximumValue={1}
                      allowChange
                      onValueChange={(newVolume) => {
                        setVolume(newVolume);
                      }}
                      roundedTrack
                      trackHeight={3}
                      color="gradient"
                      paddingVertical={16}
                    />
                  </View>
                </View>

                <View className="flex flex-row justify-between items-center mt-3">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={toggleLoopStates}
                  >
                    {stopAfterCurrentTrack && (
                      <StyledText
                        size="xl"
                        weight="extrabold"
                        style={{
                          color: COLORS.neutral.light,
                          padding: 2,
                        }}
                        className="leading-none ml-2 underline"
                      >
                        1
                      </StyledText>
                    )}
                    {playUntilLastTrack && (
                      <MaterialIcons
                        name="arrow-right-alt"
                        size={32}
                        color={COLORS.neutral.light}
                      />
                    )}
                    {!stopAfterCurrentTrack && !playUntilLastTrack && (
                      <LoopIcon
                        loopType={
                          isLoopingSingle
                            ? 'one'
                            : isLoopingQueue
                            ? 'all'
                            : 'off'
                        }
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7}>
                    <MaterialIcons
                      name="devices"
                      size={28}
                      color={COLORS.neutral.light}
                    />
                  </TouchableOpacity>
                </View>

                {/* End of Controls */}
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: COLORS.neutral.dense,
  },

  trackInfoWrapper: {
    padding: 12,
  },

  rootWrapper: {
    padding: 16,
  },
});

export default TrackPlayer;
