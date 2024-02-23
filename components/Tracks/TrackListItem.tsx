import { View, Text } from 'react-native';
import React from 'react';
import { StyledTouchableOpacity } from '../reusables/StyledButton';
import { MaterialIcons } from '@expo/vector-icons';
import StyledText from '../reusables/StyledText';
import ImageDisplay from '../reusables/ImageDisplay';
import COLORS from '@/constants/Colors';

interface ITrackListItemProps {
  id: string;
  title: string;
  artistName?: string;
  artistId?: string;
  cover: string | null;
  duration: number;
}
const TRACK_PLACEHOLDER_IMAGE = require('../../assets/images/placeholder/track.jpg');

const TrackListItem = ({
  id,
  title,
  artistName,
  artistId,
  cover,
  duration,
}: ITrackListItemProps) => {
  // using react native reanimated, make the component appear coming from the right

  return (
    <StyledTouchableOpacity bordered={false}>
      <MaterialIcons name="play-arrow" size={24} color="white" />

      <ImageDisplay
        source={cover || TRACK_PLACEHOLDER_IMAGE}
        placeholder={''}
        width={50}
        height={50}
        borderRadius={4}
        className="ml-2"
        style={{
          borderColor: COLORS.neutral.semidark,
          borderWidth: 1,
        }}
      />

      <View className="flex flex-1 flex-col ml-2">
        <StyledText size="base" weight="semibold">
          {title}
        </StyledText>
        <StyledText size="sm" weight="light" dimness="extra">
          {artistName}
        </StyledText>
      </View>
      <MaterialIcons name="favorite" size={24} color="white" className="ml-2" />
      <MaterialIcons
        name="more-vert"
        size={24}
        color="white"
        className="ml-2"
      />
    </StyledTouchableOpacity>
  );
};

export default TrackListItem;
