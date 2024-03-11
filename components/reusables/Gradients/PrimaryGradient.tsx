import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';
import { View } from 'react-native';

interface IPrimaryGradientProps extends React.ComponentProps<typeof View> {
  opacity?: number;
}

const PrimaryGradient = ({
  opacity = 0.15,
  ...rest
}: IPrimaryGradientProps) => {
  return (
    <LinearGradient
      colors={[
        COLORS.primary.light,
        ...COLORS.gradient.primary,
        COLORS.primary.dark,
      ]}
      style={[
        {
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: -1,
          opacity,
          flex: 1,
          top: 0,
          left: 0,
        },
        rest.style,
      ]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
    />
  );
};

export default PrimaryGradient;
