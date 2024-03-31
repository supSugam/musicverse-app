import React from 'react';
import AnimatedTouchable from './AnimatedTouchable';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';

const PlayButton = ({
  isPlaying,
  onPlayClick,
}: {
  isPlaying?: boolean;
  onPlayClick: () => void;
}) => {
  return (
    <AnimatedTouchable
      className="mr-2"
      onPress={onPlayClick}
      activeOpacity={0.8}
    >
      <MaterialIcons
        name={isPlaying ? 'pause' : 'play-arrow'}
        size={28}
        color={COLORS.neutral.light}
      />
    </AnimatedTouchable>
  );
};

export default PlayButton;
