import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';

interface IPrimaryGradientProps {
  opacity?: number;
}

const PrimaryGradient = ({ opacity = 0.15 }: IPrimaryGradientProps) => {
  return (
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
        opacity,
        flex: 1,
        top: 0,
        left: 0,
      }}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
    />
  );
};

export default PrimaryGradient;
