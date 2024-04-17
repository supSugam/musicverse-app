import AlbumCard from '@/components/Albums/AlbumCard';
import Container from '@/components/Container';
import PlaylistPreviewList from '@/components/Playlist/PlaylistPreviewList';
import RecentSearchCard from '@/components/Search/RecentSearchCard';
import TrackListItem from '@/components/Tracks/TrackListItem';
import TrackPreview from '@/components/Tracks/TrackPreview';
import EmptyGhost from '@/components/reusables/Lottie/EmptyGhost';
import SearchField from '@/components/reusables/SearchField';
import ListSkeleton from '@/components/reusables/Skeleton/ListSkeleton';
import { Skeleton } from '@/components/reusables/Skeleton/Skeleton';
import SquareSkeleton from '@/components/reusables/Skeleton/SquareSkeleton';
import StyledText from '@/components/reusables/StyledText';
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
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { UIImagePickerPreferredAssetRepresentationMode } from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

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
  const { recentSearches, addRecentSearch, updateRecentSearches } =
    useAppState();
  const { data, isRefetching, refetch, isLoading } = useQuery<
    AxiosResponse<SuccessResponse<SearchResults>>
  >({
    queryKey: ['search', searchParams],
    queryFn: async () =>
      await api.get('/paginate/search', {
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

  useEffect(() => {
    updateRecentSearches();
  }, []);

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

        {(!searchParams.search || !searchParams.search.length) && (
          <>
            {recentSearches.length === 0 ? (
              <EmptyGhost
                caption="Search for tracks, albums, artists, playlists or users"
                wrapperStyles={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: 'transparent',
                  height: '100%',
                  flexShrink: 1,
                }}
                gradient={0.1}
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
              <View className="w-full">
                <StyledText weight="bold" size="lg" className="mt-4 mb-2">
                  Recent Searches
                </StyledText>
                {recentSearches.map((recent, i) => {
                  return (
                    <RecentSearchCard
                      key={recent.data.id + recent.data.createdAt + i}
                      recentSearch={recent}
                    />
                  );
                })}
              </View>
            )}
          </>
        )}

        <ScrollView className="w-full">
          <Skeleton
            isLoading={isLoading || isRefetching}
            skeletonComponent={
              <View className="flex flex-col w-full">
                <ListSkeleton numbers={3} />
                <SquareSkeleton numbers={3} />
                <ListSkeleton numbers={3} />
              </View>
            }
            className="w-full"
          >
            {/* Tracks */}
            {allData?.tracks && allData?.tracks?.items.length > 0 && (
              <View className="flex flex-col w-full">
                <StyledText
                  weight="semibold"
                  size="lg"
                  opacity="high"
                  className="my-2"
                >
                  Songs
                </StyledText>
                {allData?.tracks?.items?.map((track) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      addRecentSearch({ type: 'Track', data: track })
                    }
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
              </View>
            )}

            {/* Playlists */}
            {allData.playlists && allData.playlists?.items.length > 0 && (
              <View className="flex flex-col w-full">
                <StyledText
                  weight="semibold"
                  size="lg"
                  opacity="high"
                  className="my-2"
                >
                  Playlists
                </StyledText>

                {allData.playlists?.items.map((playlist, i) => (
                  <PlaylistPreviewList
                    key={playlist.id}
                    cover={playlist.cover}
                    onPress={() => {}}
                    duration={i * 100}
                    rightComponent={
                      <MaterialIcons
                        name={'more-vert'}
                        size={28}
                        color={COLORS.neutral.normal}
                        style={{
                          marginRight: 2,
                        }}
                      />
                    }
                    subtitle={`${playlist._count.tracks} tracks • ${playlist._count.savedBy} saves`}
                    title={playlist.title}
                  />
                ))}
              </View>
            )}

            {/* Albums */}
            {allData.albums && allData.albums?.items.length > 0 && (
              <View className="flex flex-col w-full overflow-visible flex-1">
                <StyledText
                  weight="semibold"
                  size="lg"
                  opacity="high"
                  className="my-2"
                >
                  Albums
                </StyledText>

                <Animated.FlatList
                  horizontal
                  data={allData.albums.items}
                  renderItem={({ item, index }) => (
                    <AlbumCard
                      key={item.id + index}
                      cover={item.cover}
                      title={item.title}
                      subtitle={`${item._count.tracks} tracks • ${item._count.savedBy} saves`}
                      genre={item.genre}
                      id={`${item.id}owned-${index}`}
                      onPlayClick={() => {
                        if (item.tracks?.length) {
                          updateTracks(item.tracks);
                          playATrackById(item.tracks[0].id);
                        }
                      }}
                      onOptionsClick={() => {
                        // setSelectedAlbum({ album: item, type: 'owned' });
                        // setIsAlbumOptionsModalVisible(true);
                      }}
                    />
                  )}
                  keyExtractor={(item, i) => `${item.id}${i}owned`}
                />
              </View>
            )}
          </Skeleton>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: '100%',
  },
});

export default SearchPage;
