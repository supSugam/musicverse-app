import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import StyledText from './StyledText';
import PrimaryGradient from './Gradients/PrimaryGradient';
import DarkGradient from '../Playlist/DarkGradient';
import COLORS from '@/constants/Colors';

interface ICapsuleProps extends React.ComponentProps<typeof TouchableOpacity> {
  text: string;
  selected?: boolean;
}

const Capsule = ({ text, selected = false, ...rest }: ICapsuleProps) => {
  const { style, ...props } = rest;
  return (
    <TouchableOpacity
      style={[
        {
          height: 30,
          paddingHorizontal: 12,
          paddingVertical: 4,
          marginRight: 8,
          borderRadius: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: selected
            ? `${COLORS.primary.violet}95`
            : `${COLORS.neutral.gray}60`,
        },
        style,
      ]}
      activeOpacity={0.85}
      {...props}
    >
      <StyledText size="sm" weight="semibold">
        {text}
      </StyledText>
    </TouchableOpacity>
  );
};

export default Capsule;
