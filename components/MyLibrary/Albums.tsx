import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ViewabilityConfigCallbackPairs,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import StyledText from '../reusables/StyledText';
import SearchField from '../reusables/SearchField';
import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import PlaylistPreviewList from '../Playlist/PlaylistPreviewList';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import MenuModal from '../reusables/BottomSheetMenu/MenuModal';
import { IMenuItemProps } from '../reusables/BottomSheetMenu/MenuItem';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import ReusableAlert from '../reusables/ReusableAlert';
import { useAlbumsQuery } from '@/hooks/react-query/useAlbumsQuery';
import AlbumCard from '../Albums/AlbumCard';
import Animated from 'react-native-reanimated';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';

const Albums = () => {
  const navigation = useNavigation();
  const [ownedAlbums, setOwnedAlbums] = useState<IAlbumDetails[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<IAlbumDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  const {
    getAllAlbums: { data: ownedAlbumsData, refetch: refetchOwnedAlbums },
    deleteAlbumById,
  } = useAlbumsQuery({
    getAllAlbumsConfig: {
      params: {
        owned: true,
        creator: true,
        genre: true,
        tracks: true,
      },
    },
  });

  const {
    getAllAlbums: { data: savedAlbumsData, refetch: refetchSavedAlbums },
  } = useAlbumsQuery({
    getAllAlbumsConfig: {
      params: {
        saved: true,
        tracks: true,
        genre: true,
        creator: true,
      },
    },
  });

  useEffect(() => {
    const albums = ownedAlbumsData?.data?.result?.items;

    if (albums) {
      setOwnedAlbums(albums);
    }
  }, [ownedAlbumsData]);

  useEffect(() => {
    const albums = savedAlbumsData?.data?.result?.items;
    if (albums) {
      setSavedAlbums(albums);
    }
  }, [savedAlbumsData]);

  const refetchAllAlbums = () => {
    refetchOwnedAlbums();
    refetchSavedAlbums();
  };

  const getAlbumOptions = (albumId?: string): IMenuItemProps[] => {
    if (!albumId) return [];
    let options: IMenuItemProps[] = [
      {
        label: 'Share',
        onPress: () => {},
        icon: 'share',
      },
    ];

    switch (selectedAlbum?.type) {
      case 'owned':
        options.push({
          label: 'Update Album',
          onPress: () => {
            setIsAlbumOptionsModalVisible(false);
            navigation.dispatch(
              CommonActions.navigate('UpdateAlbum', {
                id: albumId,
              })
            );
          },
          icon: 'edit',
        });
        options.push({
          label: 'Delete',
          onPress: () => {
            setIsAlbumOptionsModalVisible(false);
            setShowDeleteAlert(true);
          },
          icon: 'delete',
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

  const [selectedAlbum, setSelectedAlbum] = useState<{
    album: IAlbumDetails;
    type: 'owned' | 'saved';
  }>();
  const [isAlbumOptionsModalVisible, setIsAlbumOptionsModalVisible] =
    useState<boolean>(false);

  //   const getModalHeader = useMemo(
  //     () => (
  //       <PlaylistPreviewList
  //         cover={selectedPlaylist?.playlist.cover || null}
  //         onPress={() => {}}
  //         subtitle={`${selectedPlaylist?.playlist._count.tracks} tracks • ${selectedPlaylist?.playlist._count.savedBy} saves`}
  //         title={selectedPlaylist?.playlist.title || ''}
  //       />
  //     ),
  //     [selectedPlaylist]
  //   );

  // Player

  const { setQueueId, updateTracks, playATrackById } = usePlayerStore();

  const [viewableAlbumCardId, setViewableAlbumCardId] = useState<{
    owned?: string;
    saved?: string;
  }>({});

  const viewabilityConfigCallbackPairsOwned =
    useRef<ViewabilityConfigCallbackPairs>([
      {
        viewabilityConfig: {
          itemVisiblePercentThreshold: 50,
        },
        onViewableItemsChanged: ({ viewableItems, changed }) => {
          setViewableAlbumCardId((prev) => {
            return {
              ...prev,
              owned: viewableItems[0].item.id,
            };
          });
        },
      },
    ]);
  const viewabilityConfigCallbackPairsSaved =
    useRef<ViewabilityConfigCallbackPairs>([
      {
        viewabilityConfig: {
          itemVisiblePercentThreshold: 50,
        },
        onViewableItemsChanged: ({ viewableItems, changed }) => {
          setViewableAlbumCardId((prev) => {
            return {
              ...prev,
              saved: viewableItems[0].item.id,
            };
          });
        },
      },
    ]);

  return (
    <>
      <ReusableAlert
        cancelText="Cancel"
        confirmText="Delete"
        visible={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={() => {
          const id = selectedAlbum?.album.id;
          if (id) deleteAlbumById.mutate(id);
          setShowDeleteAlert(false);
        }}
        type="alert"
        header="Delete Album"
      >
        <StyledText size="base">
          Are you sure you want to delete this album?
        </StyledText>
      </ReusableAlert>
      <MenuModal
        visible={isAlbumOptionsModalVisible}
        onClose={() => setIsAlbumOptionsModalVisible(false)}
        items={getAlbumOptions(selectedAlbum?.album.id)}
        header={selectedAlbum?.album.title}
      />

      <ScrollView
        className="flex flex-1 p-5"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetchAllAlbums} />
        }
      >
        <SearchField
          onSearch={(text) => {
            setSearchTerm(text);
          }}
          placeholder="Search Albums"
        />
        {ownedAlbums.length > 0 && (
          <View className="flex flex-col w-full overflow-visible flex-1">
            <StyledText weight="semibold" size="xl" className="my-4">
              Owned Albums
            </StyledText>

            <Animated.FlatList
              horizontal
              data={ownedAlbums}
              renderItem={({ item, index }) => (
                <AlbumCard
                  key={item.id + index}
                  cover={item.cover}
                  title={item.title}
                  subtitle={`${item._count.tracks} tracks • ${item._count.savedBy} saves`}
                  genre={item.genre}
                  id={`${item.id}owned-${index}`}
                  isCardViewable={
                    viewableAlbumCardId.owned === item.id &&
                    ownedAlbums.length > 1
                  }
                  onPlayClick={() => {
                    if (item.tracks?.length) {
                      updateTracks(item.tracks);
                      setQueueId(item.id);
                      playATrackById(item.tracks[0].id);
                    }
                  }}
                  onOptionsClick={() => {
                    setSelectedAlbum({ album: item, type: 'owned' });
                    setIsAlbumOptionsModalVisible(true);
                  }}
                />
              )}
              keyExtractor={(item, i) => `${item.id}${i}owned`}
              viewabilityConfigCallbackPairs={
                viewabilityConfigCallbackPairsOwned.current
              }
              style={{
                // items should be able to overflow
                overflow: 'visible',
              }}
            />
          </View>
        )}
        {savedAlbums.length > 0 && (
          <View className="flex flex-col w-full">
            <StyledText weight="semibold" size="xl" className="mt-4">
              Saved Albums
            </StyledText>

            <Animated.FlatList
              data={savedAlbums}
              renderItem={({ item, index }) => (
                <AlbumCard
                  key={item.id + index}
                  cover={item.cover}
                  title={item.title}
                  subtitle={`${item._count.tracks} tracks • ${item._count.savedBy} saves`}
                  genre={item.genre}
                  id={`${item.id}saved-${index}`}
                  isCardViewable={
                    viewableAlbumCardId.saved === item.id &&
                    savedAlbums.length > 1
                  }
                  onPlayClick={() => {
                    if (item.tracks?.length) {
                      updateTracks(item.tracks);
                      setQueueId(item.id);
                      playATrackById(item.tracks[0].id);
                    }
                  }}
                  onOptionsClick={() => {
                    setSelectedAlbum({ album: item, type: 'saved' });
                    setIsAlbumOptionsModalVisible(true);
                  }}
                />
              )}
              keyExtractor={(item, i) => `${item.id}${i}saved`}
              viewabilityConfigCallbackPairs={
                viewabilityConfigCallbackPairsSaved.current
              }
              style={{
                // items should be able to overflow
                overflow: 'visible',
              }}
            />

            {/* {savedAlbums.map((album, i) => (
              <AlbumCard
                key={album.id}
                cover={album.cover}
                title={album.title}
                subtitle={`${album._count.tracks} tracks • ${album._count.savedBy} saves`}
                genre={album.genre}
                id={album.id}
                onPlayClick={() => {
                  if (album.tracks?.length) {
                    updateTracks(album.tracks);
                    setQueueId(album.id);
                    playATrackById(album.tracks[0].id);
                  }
                }}
                onOptionsClick={() => {
                  setSelectedAlbum({ album, type: 'saved' });
                  setIsAlbumOptionsModalVisible(true);
                }}
              />
            ))} */}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Albums;
