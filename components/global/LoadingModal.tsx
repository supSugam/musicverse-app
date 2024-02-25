import React, { useEffect } from 'react';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import ModalWrapper from '../reusables/ModalWrapper';
import LottieView from 'lottie-react-native';
import { LoadingIndicatorLA } from '@/assets/lottie';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const LoadingModal: React.FC = () => {
  const { isLoading } = useAppState((state) => state);

  const scale = useSharedValue(0);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    scale.value = withSpring(isLoading ? 1 : 0, {
      duration: 500,
      stiffness: 100,
    });
  }, [isLoading]);

  return (
    <ModalWrapper
      fullWidth
      visible={isLoading}
      animationType="fade"
      transparent
    >
      <Animated.View
        style={[
          { flex: 1, justifyContent: 'center', alignItems: 'center' },
          animationStyle,
        ]}
      >
        <LottieView
          source={LoadingIndicatorLA}
          autoPlay
          loop
          speed={1}
          style={{
            width: 111,
            height: 111,
            alignSelf: 'center',
          }}
        />
      </Animated.View>
    </ModalWrapper>
  );
};

export default LoadingModal;
