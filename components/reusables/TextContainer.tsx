import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import StyledText from './StyledText';
import COLORS from '@/constants/Colors';

interface ITextContainerProps extends React.ComponentProps<typeof Text> {
  heading: string;
  text?: string | null;
  maxHeight?: number;
  padding?: [number, number];
}
const TextContainer = ({
  text,
  maxHeight,
  heading,
  padding: [paddingHorizontal, paddingVertical] = [8, 6],
  ...textProps
}: ITextContainerProps) => {
  return (
    <ScrollView
      className="flex flex-col w-full"
      style={{
        ...(maxHeight && { maxHeight }),
        paddingHorizontal,
        paddingVertical,
      }}
      stickyHeaderIndices={[0]}
    >
      <StyledText
        size="xl"
        weight="bold"
        style={{
          borderBottomColor: COLORS.primary.light,
          borderBottomWidth: 1,
          paddingBottom: 8,
        }}
      >
        {heading}
      </StyledText>
      <StyledText
        size="lg"
        weight="light"
        opacity="high"
        className="mt-3 text-center leading-8"
        {...textProps}
      >
        {text || 'No Description Available.'}
      </StyledText>
    </ScrollView>
  );
};

export default TextContainer;
