import { View, Text } from 'react-native';
import React from 'react';
import AnimatedTouchable from './AnimatedTouchable';
import { MaterialIcons } from '@expo/vector-icons';
import StyledText from './StyledText';
import { useNavigation } from 'expo-router';
import COLORS from '@/constants/Colors';

interface IBackButtonProps {
  showBackText?: boolean;
  iconSize?: number;
}

const BackButton = ({
  showBackText = false,
  iconSize = 36,
}: IBackButtonProps) => {
  const navigation = useNavigation();

  if (!navigation.canGoBack()) return null;
  return (
    <AnimatedTouchable
      wrapperClassName="flex flex-row items-center"
      onPress={() => navigation.goBack()}
    >
      <MaterialIcons
        name="chevron-left"
        size={iconSize}
        color={COLORS.neutral.light}
      />
      {showBackText && (
        <StyledText weight="bold" size="lg" color={COLORS.neutral.light}>
          Back
        </StyledText>
      )}
    </AnimatedTouchable>
  );
};

export default BackButton;
