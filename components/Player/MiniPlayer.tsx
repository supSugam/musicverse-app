import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  GLOBAL_STYLES,
  TAB_ROUTE_NAMES,
  TRACK_PLACEHOLDER_IMAGE,
} from '@/utils/constants';
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
import { TabRouteName } from '@/utils/helpers/types';
import useKeyboardListener from '@/hooks/useKeyboardListener';
import { CommonActions } from '@react-navigation/native';

const MiniPlayer = ({ activeTab }: { activeTab: TabRouteName | null }) => {
  const translateY = useSharedValue(GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT * 5);
  const isKeyboardOpen = useKeyboardListener();
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
    isAsyncOperationPending,
    currentTrack: currTrack,
  } = usePlayerStore();
  const currentTrack = currTrack();
  useEffect(() => {
    const showPlayerAboveTabBar =
      activeTab &&
      currentTrack &&
      TAB_ROUTE_NAMES.includes(activeTab) &&
      activeTab !== 'Upload' &&
      !isKeyboardOpen;

    if (showPlayerAboveTabBar) {
      translateY.value = withSpring(
        0,
        // showPlayerAboveTabBar ? 0 : GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT * 2,
        {
          damping: 10, // Decreased damping value for faster animation
          stiffness: 90, // Increased stiffness value for faster animation
          overshootClamping: true, // Keep overshoot clamping enabled
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }
      );
    } else {
      translateY.value = withSpring(GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT * 2, {
        damping: 10, // Decreased damping value for faster animation
        stiffness: 90, // Increased stiffness value for faster animation
        overshootClamping: true, // Keep overshoot clamping enabled
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      });
    }
  }, [currentTrack, activeTab, isKeyboardOpen]);

  // API

  const [isTrackLiked, setIsTrackLiked] = useState<boolean>(false);
  const {
    toggleLike: { mutate, isPending },
  } = useTracksQuery({ id: currentTrack?.id });

  const onLikeClick = () => {
    setIsTrackLiked((prev) => !prev);
    if (isPending || !currentTrack?.id) return;
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
  useEffect(() => {
    setIsTrackLiked(currentTrack?.isLiked || false);
  }, []);

  const changeTrackGesture = useSwipeGesture({
    onSwipeLeft: () => {
      console.log('swiped left');
      nextTrack();
    },
    onSwipeRight: () => prevTrack(),
    onSwipeUp: () => navigation.dispatch(CommonActions.navigate('TrackPlayer')),
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
          navigation.dispatch(CommonActions.navigate('TrackPlayer'));
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
                  name={isTrackLiked ? 'heart' : 'heart-o'}
                  size={24}
                  color={
                    isTrackLiked ? COLORS.neutral.white : COLORS.neutral.light
                  }
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
