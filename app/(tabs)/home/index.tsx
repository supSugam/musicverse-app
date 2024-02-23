// app/tabs/home/HomeScreen.tsx
import Container from '@/components/Container';
import TrackListItem from '@/components/Tracks/TrackListItem';
import GenreScrollView from '@/components/home/GenreScrollView';
import StyledText from '@/components/reusables/StyledText';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const HomeScreen: React.FC = () => {
  const { currentUser, currentUserProfile } = useAuthStore((state) => state);

  // Genres
  const { genres, isLoading: isGenresLoading } = useGenreQuery();

  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  // Tracks

  const [tracksOfSelectedGenre, setTracksOfSelectedGenre] = useState<
    ITrackDetails[]
  >([]);

  const { getAllTracks } = useTracksQuery({
    params: {
      genre: true,
      creator: true,
      ...(selectedGenre !== 'All' && {
        selectedGenre: genres.find((genre) => genre.name === selectedGenre)?.id,
      }),
    },
  });

  const { data } = getAllTracks;
  useEffect(() => {
    if (data) {
      setTracksOfSelectedGenre(data.data.result.items);
    }
  }, [data]);

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

        <View className="flex flex-col mt-8">
          {tracksOfSelectedGenre.map((track) => (
            <TrackListItem
              key={track.id}
              id={track.id}
              title={track.title}
              artistName={track?.creator?.username}
              artistId={track?.creator?.id}
              cover={track.cover}
              duration={track.trackDuration}
            />
          ))}
        </View>
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
