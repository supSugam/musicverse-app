import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import React from 'react';
import LottieView, { LottieViewProps } from 'lottie-react-native';
import { EmptyGhostLA } from '@/assets/lottie';
import StyledText from '../StyledText';

interface IEmptyGhostProps {
  caption?: string;
  wrapperStyles?: StyleProp<ViewStyle>;
  lottieProps?: LottieViewProps & { containerProps?: ViewProps };
}
const EmptyGhost = ({
  lottieProps,
  caption,
  wrapperStyles,
}: IEmptyGhostProps) => {
  return (
    <View
      className="flex justify-between items-center w-full"
      style={wrapperStyles}
    >
      <LottieView
        source={EmptyGhostLA}
        autoPlay
        loop
        speed={0.5}
        style={{
          width: '100%',
          height: 140,
          transform: [
            {
              scale: 1.5,
            },
            {
              translateY: -5,
            },
          ],
        }}
        {...lottieProps}
      />
      {caption && (
        <StyledText weight="bold" size="xl" className="text-center mt-2">
          {caption}
        </StyledText>
      )}
    </View>
  );
};

export default EmptyGhost;
