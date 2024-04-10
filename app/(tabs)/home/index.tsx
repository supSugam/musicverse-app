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
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfilePage from '../profile';
import AlbumPage from '../album';

const Stack = createNativeStackNavigator();

const Home: React.FC = () => {
  const { currentUser, currentUserProfile } = useAuthStore();

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
  } = usePlayerStore();

  useEffect(() => {
    if (data) {
      const { items: tracks } = data.data.result;
      setTracksOfSelectedGenre(tracks);
    }
  }, [data, playerTracks]);

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
                updateTracks(tracksOfSelectedGenre);
                await playATrackById(track.id);
              }}
              isPlaying={currentTrack()?.id === track.id && isPlaying}
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
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 15,
  },
});

export default function HomeStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBackTitleVisible: Platform.OS === 'ios' ? true : false,
      }}
      initialRouteName="HomeScreen"
    >
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AlbumPage"
        component={AlbumPage}
        options={{
          headerShown: false,
          animation: 'ios',
        }}
      />
      <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
