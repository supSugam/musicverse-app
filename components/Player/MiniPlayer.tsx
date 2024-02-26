import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GLOBAL_STYLES, TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import COLORS from '@/constants/Colors';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { LinearGradient } from 'expo-linear-gradient';
import ImageDisplay from '../reusables/ImageDisplay';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import StyledText from '../reusables/StyledText';

const MiniPlayer = () => {
  const translateY = useSharedValue(-GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT - 10);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const { currentTrack } = usePlayerStore();

  useEffect(() => {
    translateY.value = withSpring(
      currentTrack ? 0 : -GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT - 10,
      {
        damping: 20,
        stiffness: 90,
        overshootClamping: false,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
      }
    );
  }, [currentTrack]);
  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
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
