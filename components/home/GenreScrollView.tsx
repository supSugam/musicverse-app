import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { IGenre } from '@/utils/Interfaces/IGenre';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {genres.map((genre) => {
        const isSelected = selectedGenre === genre;
        const isAll = genre === 'All';
        return (
          <Pressable
            key={genre}
            onPress={() => onGenreChange(genre)}
            style={{
              paddingHorizontal: isAll ? 16 : 12,
              paddingVertical: 3,
              marginRight: 8,
              backgroundColor: isSelected
                ? COLORS.primary.light
                : COLORS.neutral.dark,
              borderRadius: 20,
            }}
          >
            <StyledText size="sm" weight="semibold">
              {genre}
            </StyledText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default GenreScrollView;
