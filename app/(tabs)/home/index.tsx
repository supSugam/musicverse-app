// app/tabs/home/HomeScreen.tsx
import Container from '@/components/Container';
import TrackListItem from '@/components/Tracks/TrackListItem';
import GenreScrollView from '@/components/home/GenreScrollView';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import {
  ITracksPaginationQueryParams,
  useTracksQuery,
} from '@/hooks/react-query/useTracksQuery';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import useRecommendations from '@/hooks/react-query/useRecommendations';
import { useAlbumsQuery } from '@/hooks/react-query/useAlbumsQuery';
import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import StyledText from '@/components/reusables/StyledText';
import GenericSquareCard from '@/components/reusables/GenericSquareCard';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import {
  Skeleton,
  SkeletonLoader,
} from '@/components/reusables/Skeleton/Skeleton';
import ListSkeleton from '@/components/reusables/Skeleton/ListSkeleton';
import CapsuleSkeleton from '@/components/reusables/Skeleton/CapsuleSkeleton';
import SquareSkeleton from '@/components/reusables/Skeleton/SquareSkeleton';

export default function Home() {
  const navigation = useNavigation();
  // Genres
  const { genres, isLoading: isGenresLoading } = useGenreQuery();

  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  // Tracks

  const [tracksOfSelectedGenre, setTracksOfSelectedGenre] = useState<
    ITrackDetails[]
  >([]);

  const InitialTracksParams: ITracksPaginationQueryParams = useMemo(() => {
    return {
      genre: true,
      creator: true,
      ...(selectedGenre !== 'All' && {
        selectedGenre: genres.find((genre) => genre.name === selectedGenre)?.id,
      }),
      pageSize: 5,
    };
  }, [selectedGenre, genres]);

  const {
    getAllTracks: {
      data,
      isLoading: isTracksLoading,
      refetch: refetchAllTracks,
      isRefetching: isTracksRefetching,
    },
  } = useTracksQuery({
    getAllTracksConfig: {
      params: InitialTracksParams,
      queryOptions: {
        enabled: !isGenresLoading,
        refetchOnWindowFocus: true,
        staleTime: 0,
      },
    },
  });

  const { setIsLoading } = useAppState();

  useEffect(() => {
    // setIsLoading(isGenresLoading || isTracksLoading);
  }, [isGenresLoading, isTracksLoading]);

  const {
    updateTracks,
    currentTrack,
    isPlaying,
    tracks: playerTracks,
    playATrackById,
    isBuffering,
    isThisTrackPlaying,
    playPause,
    setQueueId,
  } = usePlayerStore();

  useEffect(() => {
    if (data) {
      const { items: tracks } = data.data.result;
      setTracksOfSelectedGenre(tracks);
    }
  }, [data, playerTracks]);

  // Popular Albums

  const [popularAlbums, setpopularAlbums] = useState<IAlbumDetails[]>([]);

  const {
    getAllAlbums: {
      data: popularAlbumsData,
      refetch: refetchpopularAlbums,
      isLoading: isPopularAlbumsLoading,
    },
  } = useAlbumsQuery({
    getAllAlbumsConfig: {
      params: {
        genre: true,
      },
    },
  });

  useEffect(() => {
    setpopularAlbums(popularAlbumsData?.data?.result?.items ?? []);
  }, [popularAlbumsData]);

  // Recommended Tracks

  const { data: recommendedTracksData } = useRecommendations();

  const [recommendations, setRecommendations] = useState<ITrackDetails[]>([]);

  useEffect(() => {
    setRecommendations(recommendedTracksData?.data?.result?.items ?? []);
  }, [recommendedTracksData]);

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
        scrollEnabled
        stickyHeaderIndices={[0]}
      >
        <Skeleton
          isLoading={
            isGenresLoading || isTracksLoading || isPopularAlbumsLoading
          }
          skeletonComponent={
            <View className="flex flex-col w-full">
              <CapsuleSkeleton numbers={5} />
              <ListSkeleton numbers={3} />
              <SquareSkeleton numbers={3} />
              <ListSkeleton numbers={3} />
            </View>
          }
          className="px-4"
        >
          <GenreScrollView
            genres={['All', ...genres.map((genre) => genre.name)]}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />

          <View
            style={{
              paddingHorizontal: 15,
            }}
            className="flex flex-col"
          >
            {tracksOfSelectedGenre.map((track, i) => (
              <TrackListItem
                index={i}
                key={track.id}
                id={track.id}
                title={track.title}
                onPlayClick={() => {
                  if (isThisTrackPlaying(track.id)) {
                    playPause();
                    return;
                  }
                  updateTracks(tracksOfSelectedGenre);
                  setQueueId(tracksOfSelectedGenre?.[0]?.id);
                  playATrackById(track.id);
                }}
                isPlaying={isThisTrackPlaying(track.id)}
                artistName={
                  track?.creator?.profile.name || track?.creator?.username
                }
                artistId={track?.creator?.id}
                cover={track.cover}
                duration={track.trackDuration}
                isLiked={track?.isLiked}
                isBuffering={isBuffering && currentTrack()?.id === track.id}
                label={i + 1}
              />
            ))}
          </View>

          <View
            className="flex flex-col w-full"
            style={{
              paddingHorizontal: 20,
            }}
          >
            <StyledText weight="semibold" size="lg" className="my-3">
              Trending Albums
            </StyledText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              {popularAlbums.map((album, index) => (
                <GenericSquareCard
                  key={album.id}
                  index={index}
                  image={album.cover || undefined}
                  title={album.title}
                  subtitle={`${album?.genre?.name}, ${album._count.tracks} tracks`}
                  onPress={() => {
                    navigation.dispatch(
                      CommonActions.navigate('AlbumPage', {
                        id: album.id,
                      })
                    );
                  }}
                />
              ))}
            </ScrollView>
          </View>

          <View
            style={{
              paddingHorizontal: 15,
              marginTop: 10,
            }}
            className="flex flex-col"
          >
            <StyledText weight="semibold" size="lg" className="my-3">
              Based on your listening
            </StyledText>
            {recommendations.map((track, i) => (
              <TrackListItem
                index={i}
                key={track.id}
                id={track.id}
                title={track.title}
                onPlayClick={() => {
                  if (isThisTrackPlaying(track.id)) {
                    playPause();
                    return;
                  }
                  updateTracks(recommendations);
                  setQueueId(recommendations?.[0]?.id);
                  playATrackById(track.id);
                }}
                isPlaying={isThisTrackPlaying(track.id)}
                artistName={
                  track?.creator?.profile.name || track?.creator?.username
                }
                artistId={track?.creator?.id}
                cover={track.cover}
                duration={track.trackDuration}
                isLiked={track?.isLiked}
                isBuffering={isBuffering && currentTrack()?.id === track.id}
                label={i + 1}
              />
            ))}
          </View>
        </Skeleton>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    maxHeight: '100%',
  },
});
