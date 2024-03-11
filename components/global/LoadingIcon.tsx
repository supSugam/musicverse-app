import { View, Text } from 'react-native';
import React from 'react';
import { LoadingIndicatorLA } from '@/assets/lottie';
import LottieView from 'lottie-react-native';

interface ILoadingIconProps {
  size?: number;
  speed?: number;
}

const LoadingIcon = ({ size = 111, speed = 1 }: ILoadingIconProps) => {
  return (
    <LottieView
      source={LoadingIndicatorLA}
      autoPlay
      loop
      speed={speed}
      style={{
        width: size,
        height: size,
        alignSelf: 'center',
      }}
    />
  );
};

export default LoadingIcon;
