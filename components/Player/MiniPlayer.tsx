import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GLOBAL_STYLES } from '@/utils/constants';
import COLORS from '@/constants/Colors';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';

const MiniPlayer = () => {
  const translateY = useSharedValue(-GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT - 10);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
      overshootClamping: false,
      restDisplacementThreshold: 0.1,
      restSpeedThreshold: 0.1,
    });
  }, []);
  return (
    <Animated.View
      style={[styles.container, containerAnimatedStyle]}
    ></Animated.View>
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
