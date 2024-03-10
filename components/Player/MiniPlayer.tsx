import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GLOBAL_STYLES, TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import ImageDisplay from '../reusables/ImageDisplay';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import StyledText from '../reusables/StyledText';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import SliderInput from '../reusables/SliderInput';
import { useNavigation } from 'expo-router';
import { useAppState } from '@/services/zustand/stores/useAppStore';

const MiniPlayer = () => {
  const translateY = useSharedValue(GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT * 5);
  const { activeTab } = useAppState();

  // Animation when

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const {
    isPlaying,
    playPause,
    prevTrack,
    nextTrack,
    playbackPosition,
    seek,
    setPlayerExpanded,
    isAsyncOperationPending,
    currentTrack: currTrack,
  } = usePlayerStore();
  const currentTrack = currTrack();

  useEffect(() => {
    const showPlayerAboveTabBar = currentTrack !== null && activeTab === 'Home';

    if (showPlayerAboveTabBar) {
      translateY.value = withSpring(
        0,
        // showPlayerAboveTabBar ? 0 : GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT * 2,
        {
          damping: 20,
          stiffness: 90,
          overshootClamping: false,
          restDisplacementThreshold: 0.1,
          restSpeedThreshold: 0.1,
        }
      );
    } else {
      translateY.value = withSpring(GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT * 5);
    }
  }, [currentTrack, activeTab]);

  // API

  const {
    toggleLike: { mutate, isPending },
  } = useTracksQuery({ id: currentTrack?.id });

  const onLikeClick = () => {
    if (isPending) return;
    if (!currentTrack) return;
    mutate(currentTrack.id);
  };

  // Favorite button animations
  const favoriteButtonScale = useSharedValue(1);
  const favoriteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteButtonScale.value }],
  }));
  const onFavBtnLeave = () => {
    favoriteButtonScale.value = withTiming(1, { duration: 250 });
  };

  const changeTrackGesture = useSwipeGesture({
    onSwipeLeft: () => {
      console.log('swiped left');
      nextTrack();
    },
    onSwipeRight: () => prevTrack(),
    onSwipeUp: () => console.log('Swiped up'),
    onSwipeDown: () => console.log('Swiped down'),
  });

  const navigation = useNavigation();
  return (
    <Animated.View
      style={[styles.container, containerAnimatedStyle]}
      className="overflow-visible"
    >
      <Pressable
        onPress={() => {
          setPlayerExpanded(true);
          navigation.navigate('TrackPlayer' as never);
        }}
        style={styles.wrapper}
        {...changeTrackGesture}
      >
        <LinearGradient
          colors={[COLORS.gradient.primary[0], COLORS.gradient.primary[1]]}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: -1,
            opacity: 0.1,
            padding: 4,
            flex: 1,
            top: 0,
            left: 0,
            borderRadius: 8,
          }}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View className="flex flex-row items-center flex-1 px-3">
          <ImageDisplay
            source={
              currentTrack?.cover
                ? { uri: currentTrack?.cover }
                : TRACK_PLACEHOLDER_IMAGE
            }
            placeholder={''}
            width={40}
            height={40}
            borderRadius={4}
            style={{
              borderColor: COLORS.neutral.semidark,
              borderWidth: 1,
            }}
          />

          <View className="flex flex-1 flex-col ml-3">
            <StyledText
              size="base"
              weight="semibold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {currentTrack?.title}
            </StyledText>
            <StyledText
              size="sm"
              weight="light"
              style={{
                color: COLORS.neutral.light,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {currentTrack?.creator?.profile?.name ||
                currentTrack?.creator?.username}
            </StyledText>
          </View>
          <View className="flex flex-row items-center ml-auto justify-end">
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
            >
              <Animated.View style={favoriteButtonStyle}>
                <FontAwesome
                  name={currentTrack?.isLiked ? 'heart' : 'heart-o'}
                  size={26}
                  color={
                    currentTrack?.isLiked
                      ? COLORS.neutral.white
                      : COLORS.neutral.light
                  }
                  className="mr-3"
                  style={{
                    marginRight: 16,
                  }}
                />
              </Animated.View>
            </Pressable>

            <TouchableOpacity onPress={() => playPause()} activeOpacity={0.8}>
              <MaterialIcons
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={28}
                color={COLORS.neutral.light}
              />
            </TouchableOpacity>
          </View>
        </View>

        <SliderInput
          currentValue={playbackPosition}
          minimumValue={0}
          maximumValue={currentTrack?.trackDuration || 0}
          onValueChange={(value) => seek(value)}
          roundedTrack
          allowChange={!isAsyncOperationPending}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT + 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 65,
    backgroundColor: COLORS.neutral.dark,
    borderRadius: 4,
    alignSelf: 'center',
    zIndex: 1,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MiniPlayer;
