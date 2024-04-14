import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { IGenre } from '@/utils/Interfaces/IGenre';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Capsule from '../reusables/Capsule';

interface IGenreScrollViewProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: string[];
}

const GenreScrollView = ({
  selectedGenre,
  onGenreChange,
  genres,
}: IGenreScrollViewProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: COLORS.neutral.dense,
        paddingVertical: 12,
      }}
    >
      {genres.map((genre) => {
        const isSelected = selectedGenre === genre;
        const isAll = genre === 'All';
        return (
          <Capsule
            onPress={() => onGenreChange(genre)}
            key={genre}
            text={genre}
            selected={isSelected}
            style={{
              paddingHorizontal: isAll ? 16 : 12,
            }}
          />
        );
      })}
    </ScrollView>
  );
};

export default GenreScrollView;
