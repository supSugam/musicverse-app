import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import React from 'react';
import LottieView, { LottieViewProps } from 'lottie-react-native';
import { EmptyGhostLA } from '@/assets/lottie';
import StyledText from '../StyledText';
import PrimaryGradient from '../Gradients/PrimaryGradient';

interface IEmptyGhostProps {
  caption?: string;
  wrapperStyles?: StyleProp<ViewStyle>;
  lottieProps?: Partial<LottieViewProps & { containerProps?: ViewProps }>;
  gradient?: number | false;
}
const EmptyGhost = ({
  lottieProps,
  caption,
  wrapperStyles,
  gradient = false,
}: IEmptyGhostProps) => {
  return (
    <View
      className="flex justify-between items-center w-full relative"
      style={wrapperStyles}
    >
      <PrimaryGradient opacity={gradient || 0} />

      <LottieView
        source={EmptyGhostLA}
        autoPlay
        loop
        speed={0.5}
        {...lottieProps}
      />
      {caption && (
        <StyledText weight="bold" size="xl" className="text-center m-2">
          {caption}
        </StyledText>
      )}
    </View>
  );
};

export default EmptyGhost;
