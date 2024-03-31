import Container from '@/components/Container';
import RecentSearchCard from '@/components/Search/RecentSearchCard';
import TrackListItem from '@/components/Tracks/TrackListItem';
import TrackPreview from '@/components/Tracks/TrackPreview';
import EmptyGhost from '@/components/reusables/Lottie/EmptyGhost';
import SearchField from '@/components/reusables/SearchField';
import COLORS from '@/constants/Colors';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import { SuccessResponse } from '@/utils/Interfaces/IApiResponse';
import { IBasePaginationParams } from '@/utils/Interfaces/IPagination';
import { IPlaylistDetails } from '@/utils/Interfaces/IPlaylist';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';
import { SearchType } from '@/utils/enums/SearchType';
import { GenericPaginationResponse } from '@/utils/helpers/ts-utilities';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface SearchPaginationParams extends IBasePaginationParams {
  type?: SearchType;
  search?: string;
}

interface SearchResults {
  tracks?: GenericPaginationResponse<ITrackDetails>;
  albums?: GenericPaginationResponse<IAlbumDetails>;
  users?: GenericPaginationResponse<IUserWithProfile>;
  artists?: GenericPaginationResponse<IUserWithProfile>;
  playlists?: GenericPaginationResponse<IPlaylistDetails>;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState<SearchPaginationParams>({
    page: 1,
    pageSize: 5,
    type: SearchType.ALL,
  });

  const [allData, setAllData] = useState<SearchResults>({});

  const { api } = useAuthStore();
  const { recentSearches, addRecentSearch } = useAppState();
  const { data, isRefetching, refetch } = useQuery<
    AxiosResponse<SuccessResponse<SearchResults>>
  >({
    queryKey: ['search', searchParams],
    queryFn: async () =>
      await api.get('/search/', {
        params: searchParams,
      }),
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (data) {
      console.log(data.data.result);
      setAllData(data.data.result);
    }
  }, [data]);

  const { updateTracks, playATrackById } = usePlayerStore();
  return (
    <Container includeNavBar navbarTitle="Search">
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SearchField
          onSearch={(search: string) => {
            setSearchParams((prev) => ({ ...prev, search }));
          }}
          placeholder="Search..."
          delay={500}
          triggerMode="debounce"
        />

        {searchParams.search?.length === 0 && recentSearches.length === 0 ? (
          <EmptyGhost
            caption="Search for tracks, albums, artists, playlists or users"
            gradient={0.1}
            wrapperStyles={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: 'transparent',
              height: '100%',
              flexShrink: 1,
            }}
            lottieProps={{
              style: {
                width: '100%',
                height: 100,

                transform: [
                  {
                    scale: 2.2,
                  },
                  {
                    translateY: -15,
                  },
                ],
              },
            }}
          />
        ) : (
          <></>
        )}

        <ScrollView className="w-full">
          {recentSearches.map((recent) => {
            return (
              <RecentSearchCard
                key={recent.data.id + recent.data.createdAt}
                recentSearch={recent}
              />
            );
          })}
          {allData?.tracks &&
            allData?.tracks?.items?.map((track) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => addRecentSearch({ type: 'Track', data: track })}
                className="w-full"
              >
                <TrackListItem
                  key={`${track.id}search`}
                  id={track.id}
                  title={track.title}
                  artistName={track.creator?.username}
                  cover={track.cover}
                  duration={track.trackDuration}
                  onPlayClick={() => {
                    if (allData.tracks) {
                      updateTracks(allData.tracks.items);
                      playATrackById(track.id);
                    }
                  }}
                />
              </TouchableOpacity>
            ))}
        </ScrollView>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: COLORS.neutral.semidark,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.neutral.white,
    marginBottom: 15,
    borderColor: `${COLORS.neutral.light}30`,
    borderWidth: 1,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
    padding: 15,
    height: '100%',
  },
});

export default SearchPage;
