// components/global/LoadingModal.tsx

import React, { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import ModalWrapper from '../reusables/ModalWrapper';
import LottieView from 'lottie-react-native';
import { PlayingMusicLA } from '@/assets/lottie';
import { View } from 'react-native';

const LoadingModal: React.FC = () => {
  const { isLoading } = useAppState((state) => state);
  const [constantlyIncreasingSpeed, setConstantlyIncreasingSpeed] =
    useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (constantlyIncreasingSpeed >= 1.6) {
        clearInterval(interval);
      }
      setConstantlyIncreasingSpeed((prev) => prev + 0.1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <ModalWrapper
      fullWidth
      visible={isLoading}
      animationType="fade"
      transparent
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={PlayingMusicLA}
          autoPlay
          loop
          speed={constantlyIncreasingSpeed}
          style={{
            width: 100,
            height: 100,
            alignSelf: 'center',
            transform: [{ scaleX: 3.5 }, { scaleY: 3.5 }],
          }}
        />
      </View>
    </ModalWrapper>
  );
};

export default LoadingModal;
