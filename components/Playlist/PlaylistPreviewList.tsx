import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import ImageDisplay from '../reusables/ImageDisplay';
import {
  PLAYLIST_PLACEHOLDER_IMAGE,
  TRACK_PLACEHOLDER_IMAGE,
} from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import DarkGradient from './DarkGradient';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';

export interface IPlaylistPreviewListProps
  extends React.ComponentProps<typeof View> {
  onPress: () => void;
  cover: string | null;
  title: string;
  subtitle: string;
  rightComponent?: React.ReactNode;
}

const PlaylistPreviewList = ({
  onPress,
  cover,
  title,
  subtitle,
  rightComponent,
  ...rest
}: IPlaylistPreviewListProps) => {
  const { style, className, ...props } = rest;
  return (
    <AnimatedTouchable onPress={onPress}>
      <View
        className="flex w-full flex-row items-center justify-between p-2 mb-2 rounded-lg"
        style={[
          {
            backgroundColor: `${COLORS.neutral.dark}80`,
          },
          style,
        ]}
        {...props}
      >
        <ImageDisplay
          source={cover ? { uri: cover } : PLAYLIST_PLACEHOLDER_IMAGE}
          placeholder={''}
          width={50}
          height={50}
          borderRadius={4}
          className="mr-3"
        />
        <View className="flex flex-col flex-1 mb-1">
          <StyledText
            numberOfLines={1}
            ellipsizeMode="tail"
            opacity="none"
            className="leading-6"
          >
            {title}
          </StyledText>
          <StyledText
            numberOfLines={1}
            ellipsizeMode="tail"
            size="sm"
            weight="light"
            opacity="high"
          >
            {subtitle}
          </StyledText>
        </View>
        <View className="flex flex-row items-center ml-auto justify-end">
          {rightComponent}
        </View>
      </View>
    </AnimatedTouchable>
  );
};

export default PlaylistPreviewList;
