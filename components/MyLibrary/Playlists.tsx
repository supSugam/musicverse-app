import { View, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import StyledText from '../reusables/StyledText';
import SearchField from '../reusables/SearchField';
import { usePlaylistsQuery } from '@/hooks/react-query/usePlaylistsQuery';
import { IPlaylistDetails } from '@/utils/Interfaces/IPlaylist';
import PlaylistPreviewList from '../Playlist/PlaylistPreviewList';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import MenuModal from '../reusables/BottomSheetMenu/MenuModal';
import { IMenuItemProps } from '../reusables/BottomSheetMenu/MenuItem';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import ReusableAlert from '../reusables/ReusableAlert';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import ListSkeleton from '../reusables/Skeleton/ListSkeleton';
import { Skeleton, SkeletonLoader } from '../reusables/Skeleton/Skeleton';

const Playlists = () => {
  const navigation = useNavigation();
  const [ownedPlaylists, setOwnedPlaylists] = useState<IPlaylistDetails[]>([]);
  const [collaboratedPlaylists, setCollaboratedPlaylists] = useState<
    IPlaylistDetails[]
  >([]);
  const [savedPlaylists, setSavedPlaylists] = useState<IPlaylistDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  const {
    getAllPlaylists: {
      data: ownedPlaylistsData,
      refetch: refetchOwnedPlaylists,
      isLoading: isLoadingOwnedPlaylists,
      isRefetching: isRefetchingOwnedPlaylists,
    },
    deletePlaylistById,
  } = usePlaylistsQuery({
    getAllPlaylistsConfig: {
      params: {
        owned: true,
        search: searchTerm,
      },
    },
  });
  const {
    getAllPlaylists: {
      data: collaboratedPlaylistsData,
      refetch: refetchCollaboratedPlaylists,
      isLoading: isLoadingCollaboratedPlaylists,
      isRefetching: isRefetchingCollaboratedPlaylists,
    },
  } = usePlaylistsQuery({
    getAllPlaylistsConfig: {
      params: {
        collaborated: true,
        search: searchTerm,
      },
    },
  });

  const {
    getAllPlaylists: {
      data: savedPlaylistsData,
      refetch: refetchSavedPlaylists,
      isLoading: isLoadingSavedPlaylists,
      isRefetching: isRefetchingSavedPlaylists,
    },
  } = usePlaylistsQuery({
    getAllPlaylistsConfig: {
      params: {
        saved: true,
        search: searchTerm,
      },
    },
  });

  useEffect(() => {
    const playlists = ownedPlaylistsData?.data?.result?.items;
    if (playlists) {
      setOwnedPlaylists(playlists);
    }
  }, [ownedPlaylistsData]);

  useEffect(() => {
    const playlists = collaboratedPlaylistsData?.data?.result?.items;
    if (playlists) {
      setCollaboratedPlaylists(playlists);
    }
  }, [collaboratedPlaylistsData]);

  useEffect(() => {
    const playlists = savedPlaylistsData?.data?.result?.items;
    if (playlists) {
      setSavedPlaylists(playlists);
    }
  }, [savedPlaylistsData]);

  const refetchAllPlaylists = () => {
    refetchOwnedPlaylists();
    refetchCollaboratedPlaylists();
    refetchSavedPlaylists();
  };

  const getPlaylistOptions = (playlistId?: string): IMenuItemProps[] => {
    if (!playlistId) return [];
    let options: IMenuItemProps[] = [
      {
        label: 'Share',
        onPress: () => {},
        icon: 'share',
      },
    ];

    switch (selectedPlaylist?.type) {
      case 'owned':
        options.push({
          label: 'Update Playlist',
          onPress: () => {
            setIsPlaylistOptionsModalVisible(false);
            navigation.dispatch(
              CommonActions.navigate('UpdatePlaylist', {
                id: playlistId,
              })
            );
          },
          icon: 'edit',
        });
        options.push({
          label: 'Delete',
          onPress: () => {
            setIsPlaylistOptionsModalVisible(false);
            setShowDeleteAlert(true);
          },
          icon: 'delete',
        });
        options.push({
          label: 'Manage Collaborators',
          onPress: () => {},
          icon: 'group',
        });

        options.push({
          label: 'Add/Remove Songs',
          onPress: () => {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'PlaylistPage',
                params: { id: playlistId },
              })
            );
          },
          icon: 'library-add',
        });
        break;
      case 'collaborated':
        options.push({
          label: 'Leave Playlist',
          onPress: () => {},
          icon: 'exit-to-app',
        });
        options.push({
          label: 'Save',
          onPress: () => {},
          icon: 'save',
        });
        break;
      case 'saved':
        options.push({
          label: 'Unsave',
          onPress: () => {},
          icon: 'delete',
        });
        break;
    }

    return options;
  };

  const [selectedPlaylist, setSelectedPlaylist] = useState<{
    playlist: IPlaylistDetails;
    type: 'owned' | 'saved' | 'collaborated';
  }>();
  const [isPlaylistOptionsModalVisible, setIsPlaylistOptionsModalVisible] =
    useState<boolean>(false);

  const getModalHeader = useMemo(
    () => (
      <PlaylistPreviewList
        cover={selectedPlaylist?.playlist.cover || null}
        onPress={() => {}}
        subtitle={`${selectedPlaylist?.playlist._count.tracks} tracks • ${selectedPlaylist?.playlist._count.savedBy} saves`}
        title={selectedPlaylist?.playlist.title || ''}
      />
    ),
    [selectedPlaylist]
  );

  return (
    <>
      <ReusableAlert
        cancelText="Cancel"
        confirmText="Delete"
        visible={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={() => {
          const id = selectedPlaylist?.playlist?.id;
          if (id) deletePlaylistById.mutate(id);
          setShowDeleteAlert(false);
        }}
        type="alert"
        header="Delete Playlist"
      >
        <StyledText size="base">
          Are you sure you want to delete this playlist?
        </StyledText>
      </ReusableAlert>
      <MenuModal
        visible={isPlaylistOptionsModalVisible}
        onClose={() => setIsPlaylistOptionsModalVisible(false)}
        items={getPlaylistOptions(selectedPlaylist?.playlist.id)}
        header={getModalHeader}
      />

      <ScrollView
        className="flex flex-1 p-5"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetchAllPlaylists} />
        }
      >
        <SearchField
          onSearch={(text) => {
            setSearchTerm(text);
          }}
          placeholder="Search playlists"
        />
        <AnimatedTouchable
          onPress={() => {
            navigation.dispatch(CommonActions.navigate('CreatePlaylist'));
          }}
        >
          <View className="flex flex-row items-center w-full px-2 py-3">
            <MaterialIcons
              name="add-circle"
              size={24}
              color={COLORS.neutral.light}
              style={{
                marginRight: 10,
              }}
            />
            <StyledText weight="semibold" size="lg">
              Create a New Playlist
            </StyledText>
          </View>
        </AnimatedTouchable>
        <Skeleton
          isLoading={
            isRefetchingOwnedPlaylists ||
            isRefetchingCollaboratedPlaylists ||
            isRefetchingSavedPlaylists ||
            isLoadingOwnedPlaylists ||
            isLoadingCollaboratedPlaylists ||
            isLoadingSavedPlaylists
          }
          skeletonComponent={
            <View className="flex flex-col w-full">
              <View className="flex flex-col w-full mb-5 mt-10">
                <SkeletonLoader type="rect" width="65%" height={15} />
                <ListSkeleton numbers={3} />
              </View>
              <View className="flex flex-col w-full mb-5">
                <SkeletonLoader type="rect" width="65%" height={15} />
                <ListSkeleton numbers={3} />
              </View>
              <View className="flex flex-col w-full mb-5">
                <SkeletonLoader type="rect" width="65%" height={15} />
                <ListSkeleton numbers={3} />
              </View>
            </View>
          }
        >
          {ownedPlaylists.length > 0 && (
            <View className="flex flex-col w-full">
              <StyledText weight="semibold" size="lg" className="mt-4">
                Owned Playlists
              </StyledText>

              {ownedPlaylists.map((playlist, i) => (
                <PlaylistPreviewList
                  key={playlist.id}
                  cover={playlist.cover}
                  onPress={() => {
                    setSelectedPlaylist({ playlist, type: 'owned' });
                    setIsPlaylistOptionsModalVisible(true);
                  }}
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

          {collaboratedPlaylists.length > 0 && (
            <View className="flex flex-col w-full">
              <StyledText weight="semibold" size="lg" className="mt-4">
                Collaborated Playlists
              </StyledText>

              {collaboratedPlaylists.map((playlist, i) => (
                <PlaylistPreviewList
                  key={playlist.id}
                  cover={playlist.cover}
                  onPress={() => {
                    setSelectedPlaylist({ playlist, type: 'collaborated' });

                    setIsPlaylistOptionsModalVisible(true);
                  }}
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

              {savedPlaylists.length > 0 && (
                <View className="flex flex-col w-full">
                  <StyledText weight="semibold" size="lg" className="mt-4">
                    Saved Playlists
                  </StyledText>

                  {savedPlaylists.map((playlist, i) => (
                    <PlaylistPreviewList
                      key={playlist.id}
                      cover={playlist.cover}
                      onPress={() => {
                        setSelectedPlaylist({ playlist, type: 'saved' });
                        setIsPlaylistOptionsModalVisible(true);
                      }}
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
            </View>
          )}
        </Skeleton>
      </ScrollView>
    </>
  );
};

export default Playlists;
