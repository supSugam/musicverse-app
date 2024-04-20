import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import COLORS from '@/constants/Colors';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import ImageDisplay from '../reusables/ImageDisplay';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import {
  GLOBAL_STYLES,
  PLAYBACK_SPEEDS,
  SLEEP_TIMER_OPTIONS,
  SleepTimerLabel,
  TRACK_PLACEHOLDER_IMAGE,
} from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import DarkGradient from '../Playlist/DarkGradient';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import TrackPreview from '../Tracks/TrackPreview';
import { getFormattedCount } from '@/utils/helpers/number';

const TrackPlayer = () => {
  // Player Store
  const {
    currentTrack,
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
    setTimerLabel,
    timerLabel,
    timeRemaining,
  } = usePlayerStore();

  const track = currentTrack();

  const onPlayerClose = () => {
    navigation.goBack();
  };

  // Modals

  const [speedOptionsModalVisible, setSpeedOptionsModalVisible] =
    useState<boolean>(false);

  const [timerOptionsModalVisible, setTimerOptionsModalVisible] =
    useState<boolean>(false);

  const [optionsMenuVisible, setOptionsMenuVisible] = useState<boolean>(false);

  // Stuffs
  const navigation = useNavigation();

  const onAddToPlaylistClick = () => {
    const trackToAdd = track;
    navigation.dispatch(
      CommonActions.navigate('AddToPlaylist', {
        screen: 'AddToPlaylistSC1',
        params: {
          track: trackToAdd,
        },
      })
    );
    setOptionsMenuVisible(false);
  };

  // Animations

  const [isTrackLiked, setIsTrackLiked] = useState<boolean>(false);
  const {
    toggleLike: { mutate, isPending },
  } = useTracksQuery({ id: track?.id });

  const onLikeClick = () => {
    setIsTrackLiked((prev) => !prev);
    if (isPending || !track?.id) return;
    mutate(track.id);
  };

  // Favorite button animations
  const favoriteButtonScale = useSharedValue(1);
  const favoriteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteButtonScale.value }],
  }));
  const onFavBtnLeave = () => {
    favoriteButtonScale.value = withTiming(1, { duration: 250 });
  };
  useEffect(() => {
    setIsTrackLiked(track?.isLiked || false);
  }, []);

  return (
    <>
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

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setOptionsMenuVisible(true)}
              >
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
                  <HorizontalMarquee speed={5000} pauseDuration={3000}>
                    <StyledText size="2xl" weight="bold">
                      {track?.title}
                    </StyledText>
                  </HorizontalMarquee>
                </View>
                <Pressable
                  onPress={onLikeClick}
                  onPressIn={() => {
                    favoriteButtonScale.value = withSpring(1.1, {
                      stiffness: 1000,
                      damping: 10,
                    });
                  }}
                  disabled={isPending}
                  onPressOut={onFavBtnLeave}
                  className="ml-4 mt-6"
                >
                  <Animated.View style={favoriteButtonStyle}>
                    <FontAwesome
                      name={isTrackLiked ? 'heart' : 'heart-o'}
                      size={24}
                      color={
                        isTrackLiked
                          ? COLORS.neutral.white
                          : COLORS.neutral.light
                      }
                      style={{
                        marginRight: 16,
                      }}
                    />
                  </Animated.View>
                </Pressable>
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

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => playPause()}
                  >
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
                      onPress={onAddToPlaylistClick}
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
                        {playbackSpeed}
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

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setTimerOptionsModalVisible(true)}
                      className="mr-2"
                    >
                      <MaterialIcons
                        name="timer"
                        size={24}
                        color={COLORS.neutral.light}
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="flex flex-row items-center justify-center">
                    <StyledText
                      size="sm"
                      weight="light"
                      opacity="medium"
                      className="leading-none"
                    >
                      {getFormattedCount(track?._count?.plays)} plays
                    </StyledText>
                  </View>
                </View>

                {/* End of Controls */}

                <View className="w-full rounded-xl relative my-4">
                  <DarkGradient opacity={0.4} />

                  <View className="flex flex-col p-6">
                    <StyledText
                      size="2xl"
                      weight="bold"
                      style={{
                        borderBottomColor: COLORS.primary.light,
                        borderBottomWidth: 1,
                        paddingBottom: 8,
                      }}
                    >
                      About this Song
                    </StyledText>
                    <StyledText
                      size="xl"
                      weight="light"
                      opacity="high"
                      className="mt-6 text-center leading-9"
                    >
                      {track?.description ||
                        'No Description Available for this song.'}
                    </StyledText>
                  </View>
                </View>

                <View className="w-full rounded-xl relative my-4">
                  <DarkGradient opacity={0.4} />

                  <View className="flex flex-col p-6">
                    <StyledText
                      size="2xl"
                      weight="bold"
                      style={{
                        borderBottomColor: COLORS.primary.light,
                        borderBottomWidth: 1,
                        paddingBottom: 8,
                      }}
                    >
                      Lyrics
                    </StyledText>

                    <ScrollView
                      style={{
                        maxHeight: 200,
                      }}
                      showsVerticalScrollIndicator
                    >
                      <StyledText
                        size="lg"
                        weight="light"
                        opacity="high"
                        className="mt-6 text-center leading-9"
                      >
                        {track?.lyrics || 'No Lyrics Available for this song.'}
                      </StyledText>
                    </ScrollView>
                  </View>
                </View>
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
          items={PLAYBACK_SPEEDS.map((speed) => {
            return {
              label: speed.label,
              onPress: () => {
                setSpeed(speed.value);
                setSpeedOptionsModalVisible(false);
              },
              icon: 'speed',
            };
          })}
        />

        <MenuModal
          visible={timerOptionsModalVisible}
          onClose={() => setTimerOptionsModalVisible(false)}
          header="Timer"
          items={Object.keys(SLEEP_TIMER_OPTIONS).map((speed) => {
            return {
              label: speed,
              onPress: () => {
                setTimerLabel(speed as SleepTimerLabel);
                setTimerOptionsModalVisible(false);
              },
              icon: 'timer',
              rightComponent:
                speed === timerLabel ? (
                  <StyledText
                    size="sm"
                    weight="light"
                    opacity="medium"
                    className="leading-none"
                  >
                    {formatDuration(timeRemaining)}
                  </StyledText>
                ) : undefined,
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

      <MenuModal
        visible={optionsMenuVisible}
        onClose={() => setOptionsMenuVisible(false)}
        header={
          <TrackPreview
            id={track?.id}
            title={track?.title}
            artistName={track?.creator?.profile.name}
            cover={track?.cover}
            duration={track?.trackDuration}
          />
        }
        items={[
          {
            label: 'Add to Playlists',
            onPress: onAddToPlaylistClick,
            icon: 'playlist-add',
          },

          {
            label: isTrackLiked
              ? 'Remove from Liked Songs'
              : 'Add to Liked Songs',
            onPress: () => {
              onLikeClick();
            },
            icon: isTrackLiked ? 'favorite' : 'favorite-border',
          },
          {
            label: 'See Artist Profile',
            onPress: () => {},
            icon: 'person',
          },
        ]}
      />
    </>
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
