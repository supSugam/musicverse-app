import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import COLORS from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ImageDisplay from '../reusables/ImageDisplay';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { GLOBAL_STYLES, TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import SliderInput from '../reusables/SliderInput';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { formatDuration } from '@/utils/helpers/string';
import SkipIcon from '@/lib/svgs/SkipIcon';
import LoopIcon from '@/lib/svgs/LoopIcon';
import MenuModal from '../reusables/BottomSheetMenu/MenuModal';
import HorizontalMarquee from '../reusables/HorizontalMarquee';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import AddToPlaylistTabs from '@/app/screens/add-to-playlist';
import { useNavigation } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';

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
    setSpeed,
    playbackSpeed,
  } = usePlayerStore();

  const track = currentTrack();

  const onPlayerClose = () => {
    setPlayerExpanded(false);
    navigation.goBack();
  };

  // Modals

  const [speedOptionsModalVisible, setSpeedOptionsModalVisible] =
    useState<boolean>(false);

  const [addToPlayListModal, setAddToPlayListModal] = useState<boolean>(false);

  const onPlaylistModalClose = () => {
    setAddToPlayListModal(false);
  };

  // Stuffs
  const { SCREEN_HEIGHT } = useScreenDimensions();
  const navigation = useNavigation();

  const onPlayPause = () => {
    playPause();
  };

  return (
    <GestureHandlerRootView style={{ width: '100%' }}>
      <Animated.View style={[styles.rootContainer]}>
        <PrimaryGradient />
        <ScrollView style={styles.rootWrapper}>
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
                  track?.cover ? { uri: track?.cover } : TRACK_PLACEHOLDER_IMAGE
                }
                placeholder=""
                width={'100%'}
                height={320}
                borderRadius={8}
              />
            </TouchableOpacity>

            <View className="flex flex-row justify-between items-center mt-6 mx-3">
              <View className="flex flex-col flex-1">
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
                <HorizontalMarquee speed={5000} pauseDuration={2000}>
                  <StyledText size="2xl" weight="bold">
                    {track?.title}
                  </StyledText>
                </HorizontalMarquee>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="heart" size={28} color={COLORS.primary.light} />
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
                paddingVertical={20}
              />

              {/* Track Duration Status */}
              <View className="flex flex-row justify-between items-center">
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
                <View className="flex flex-row items-center justify-center">
                  {/* Loop Button */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={toggleLoopStates}
                    className="flex flex-row items-center justify-center mr-2"
                  >
                    {stopAfterCurrentTrack && (
                      <View className="px-1 flex-col">
                        <StyledText
                          size="xl"
                          weight="extrabold"
                          style={{
                            color: COLORS.neutral.light,
                          }}
                          className="ml-1"
                        >
                          1
                        </StyledText>
                        <View
                          style={{
                            height: 2,
                            backgroundColor: COLORS.neutral.light,
                          }}
                          className="w-5 rounded-md"
                        />
                      </View>
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

                  {/* Add/Remove from/to playlist(s) */}

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      navigation.navigate('AddToPlaylist' as never)
                    }
                    className="mr-2"
                  >
                    <MaterialIcons
                      name="library-add"
                      size={24}
                      color={COLORS.neutral.light}
                    />
                  </TouchableOpacity>

                  {/* Playback Speed */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSpeedOptionsModalVisible(true)}
                    className="mr-3 flex flex-row items-baseline"
                  >
                    <StyledText
                      size="xl"
                      weight="light"
                      opacity="medium"
                      className="leading-none"
                      tracking="tighter"
                      style={{
                        fontFamily: 'Oswald-Regular',
                      }}
                    >
                      {playbackSpeed}.25
                    </StyledText>
                    <StyledText
                      size="sm"
                      weight="light"
                      opacity="medium"
                      className="leading-none"
                    >
                      x
                    </StyledText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* End of Controls */}
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Menu Modal for selecting playback speed */}
      <MenuModal
        visible={speedOptionsModalVisible}
        onClose={() => setSpeedOptionsModalVisible(false)}
        header="Speed"
        // TODO: Custom Playback Speed
        items={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => {
          return {
            label: speed === 1 ? 'Normal' : `${speed}x`,
            onPress: () => {
              setSpeed(speed);
              setSpeedOptionsModalVisible(false);
            },
            icon: 'speed',
          };
        })}
      />

      {/* <ModalWrapper
          visible={addToPlayListModal}
          animationType="fade"
          doNotUseWrapper
          onRequestClose={onPlaylistModalClose}
          onClose={onPlaylistModalClose}
          position="start"
          fullWidth
        >
        </ModalWrapper> */}
    </GestureHandlerRootView>
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
