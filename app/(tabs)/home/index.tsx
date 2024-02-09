// app/tabs/home/HomeScreen.tsx
import Container from '@/components/Container';
import GenreScrollView from '@/components/home/GenreScrollView';
import NavBar from '@/components/home/NavBar';
import StyledText from '@/components/reusables/StyledText';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { toastResponseMessage } from '@/utils/toast';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const HomeScreen: React.FC = () => {
  const { currentUser, currentUserProfile } = useAuthStore((state) => state);

  // Genres
  const { genres, isLoading: isGenresLoading } = useGenreQuery();

  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  return (
    <Container includeNavBar navbarTitle="Home">
      <ScrollView style={styles.scrollView}>
        {/* <View>
          <StyledText size="2xl" weight="bold" tracking="tighter">
            Hi, {currentUserProfile?.name || currentUser?.username}!
          </StyledText>
        </View> */}
        {/* 
        a horizontal scroll view of the user's favorite categories
        */}
        <GenreScrollView
          genres={['All', ...genres.map((genre) => genre.name)]}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 15,
  },
});
