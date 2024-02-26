import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GLOBAL_STYLES, TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import COLORS from '@/constants/Colors';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { LinearGradient } from 'expo-linear-gradient';
import ImageDisplay from '../reusables/ImageDisplay';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import StyledText from '../reusables/StyledText';
import { FontAwesome } from '@expo/vector-icons';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';

const MiniPlayer = () => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const translateY = useSharedValue(GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT * 2);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const currentTrack = usePlayerStore((state) => state.currentTrack());

  useEffect(() => {
    translateY.value = withSpring(
      currentTrack !== null ? 0 : GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT * 2,
      {
        damping: 20,
        stiffness: 90,
        overshootClamping: false,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
      }
    );
  }, [currentTrack]);

  // API

  const {
    toggleLike: { mutate, isPending },
  } = useTracksQuery({ id: currentTrack?.id });

  const onLikeClick = () => {
    if (isPending) return;
    if (!currentTrack) return;
    mutate(currentTrack.id);
    setIsFavorite((prev) => !prev);
  };

  // Favorite button animations
  const favoriteButtonScale = useSharedValue(1);
  const favoriteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteButtonScale.value }],
  }));
  const onFavBtnLeave = () => {
    favoriteButtonScale.value = withTiming(1, { duration: 250 });
  };
  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
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

      <View className="flex flex-row items-center px-2">
        {/* <TouchableOpacity onPress={onPlayClick} activeOpacity={0.8}>
          <MaterialIcons
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={28}
            color={COLORS.neutral.light}
          />
        </TouchableOpacity> */}

        <ImageDisplay
          source={currentTrack?.cover || TRACK_PLACEHOLDER_IMAGE}
          placeholder={''}
          width={40}
          height={40}
          borderRadius={4}
          style={{
            borderColor: COLORS.neutral.semidark,
            borderWidth: 1,
          }}
          className="ml-4"
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
            dimness="extra"
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
        <View className="flex flex-row items-center ml-3 flex-1 justify-end">
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
                name={isFavorite ? 'heart' : 'heart-o'}
                size={26}
                color={isFavorite ? COLORS.neutral.white : COLORS.neutral.light}
                className="mr-3"
                style={{
                  marginRight: 16,
                }}
              />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT + 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '96%',
    height: 60,
    backgroundColor: COLORS.neutral.dark,
    borderRadius: 4,
    alignSelf: 'center',
    zIndex: 1,
  },
});

export default MiniPlayer;
