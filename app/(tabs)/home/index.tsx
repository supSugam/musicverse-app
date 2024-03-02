// app/tabs/home/HomeScreen.tsx
import Container from '@/components/Container';
import TrackListItem from '@/components/Tracks/TrackListItem';
import GenreScrollView from '@/components/home/GenreScrollView';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

const HomeScreen: React.FC = () => {
  const { currentUser, currentUserProfile } = useAuthStore((state) => state);

  // Genres
  const { genres, isLoading: isGenresLoading } = useGenreQuery();

  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  // Tracks

  const [tracksOfSelectedGenre, setTracksOfSelectedGenre] = useState<
    ITrackDetails[]
  >([]);

  const InitialTracksParams = useMemo(() => {
    return {
      genre: true,
      creator: true,
      ...(selectedGenre !== 'All' && {
        selectedGenre: genres.find((genre) => genre.name === selectedGenre)?.id,
      }),
    };
  }, [selectedGenre, genres]);

  const {
    getAllTracks: {
      data,
      isLoading: isTracksLoading,
      refetch: refetchAllTracks,
    },
  } = useTracksQuery({
    getAllTracksConfig: {
      params: InitialTracksParams,
      queryOptions: {
        enabled: !isGenresLoading,
        refetchOnWindowFocus: false,
        staleTime: 0,
      },
    },
  });

  const { setIsLoading } = useAppState();

  useEffect(() => {
    if (data) {
      const { items: tracks } = data.data.result;
      setTracksOfSelectedGenre(tracks);
      updateTracks(tracks);
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(isGenresLoading || isTracksLoading);
  }, [isGenresLoading, isTracksLoading]);

  const {
    updateTracks,
    playPause,
    loadTrack,
    currentTrack,
    isPlaying,
    tracks: playerTracks,
    enableSingleLooping,
    enableQueueLooping,
    playATrackById,
    resetPlayer,
    isBuffering,
  } = usePlayerStore((state) => state);

  return (
    <Container includeNavBar navbarTitle="Home">
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isGenresLoading}
            onRefresh={() => {
              refetchAllTracks();
            }}
          />
        }
      >
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

        <View className="flex flex-col mt-4">
          {tracksOfSelectedGenre.map((track, i) => (
            <TrackListItem
              key={track.id}
              id={track.id}
              title={track.title}
              onPlayClick={async () => {
                await playATrackById(track.id);
              }}
              isPlaying={currentTrack()?.id === track.id && isPlaying}
              artistName={track?.creator?.username}
              artistId={track?.creator?.id}
              cover={track.cover}
              duration={track.trackDuration}
              isLiked={track?.isLiked}
              isBuffering={isBuffering && currentTrack()?.id === track.id}
              label={i + 1}
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
