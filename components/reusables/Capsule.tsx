import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import StyledText from './StyledText';
import PrimaryGradient from './Gradients/PrimaryGradient';
import DarkGradient from '../Playlist/DarkGradient';
import COLORS from '@/constants/Colors';

interface ICapsuleProps extends React.ComponentProps<typeof TouchableOpacity> {
  text: string;
  selected: boolean;
}

const Capsule = ({ text, selected, ...rest }: ICapsuleProps) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
        borderRadius: 20,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: selected
          ? `${COLORS.primary.violet}95`
          : `${COLORS.neutral.gray}60`,
      }}
      activeOpacity={0.85}
      {...rest}
    >
      <StyledText size="sm" weight="semibold">
        {text}
      </StyledText>
    </TouchableOpacity>
  );
};

export default Capsule;
