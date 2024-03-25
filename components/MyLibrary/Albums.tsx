import { View, Text, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
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
        search: searchTerm,
      },
    },
  });

  const {
    getAllAlbums: { data: savedAlbumsData, refetch: refetchSavedAlbums },
  } = useAlbumsQuery({
    getAllAlbumsConfig: {
      params: {
        saved: true,
        search: searchTerm,
      },
    },
  });

  useEffect(() => {
    const Albums = ownedAlbumsData?.data?.result?.items;
    if (Albums) {
      setOwnedAlbums(Albums);
    }
  }, [ownedAlbumsData]);

  useEffect(() => {
    const Albums = savedAlbumsData?.data?.result?.items;
    if (Albums) {
      setSavedAlbums(Albums);
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
        header="Delete Playlist"
      >
        <StyledText size="base">
          Are you sure you want to delete this playlist?
        </StyledText>
      </ReusableAlert>
      <MenuModal
        visible={isAlbumOptionsModalVisible}
        onClose={() => setIsAlbumOptionsModalVisible(false)}
        items={getAlbumOptions(selectedAlbum?.album.id)}
        // header={getModalHeader}
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
          <View className="flex flex-col w-full">
            <StyledText weight="semibold" size="lg" className="mt-4">
              Owned Albums
            </StyledText>

            {ownedAlbums.map((album, i) => (
              <></>
              //   <PlaylistPreviewList
              //     key={playlist.id}
              //     cover={playlist.cover}
              //     onPress={() => {

              //     }}
              //     duration={i * 100}
              //     rightComponent={
              //       <MaterialIcons
              //         name={'more-vert'}
              //         size={28}
              //         color={COLORS.neutral.normal}
              //         style={{
              //           marginRight: 2,
              //         }}
              //       />
              //     }
              //     subtitle={`${album._count.tracks} tracks • ${album._count.savedBy} saves`}
              //     title={album.title}
              //   />
            ))}
          </View>
        )}
        {savedAlbums.length > 0 && (
          <View className="flex flex-col w-full">
            <StyledText weight="semibold" size="lg" className="mt-4">
              Saved Albums
            </StyledText>

            {savedAlbums.map((playlist, i) => (
              <></>
              //   <PlaylistPreviewList
              //     key={playlist.id}
              //     cover={playlist.cover}
              //     onPress={() => {
              //       setSelectedPlaylist({ playlist, type: 'saved' });
              //       setIsPlaylistOptionsModalVisible(true);
              //     }}
              //     duration={i * 100}
              //     rightComponent={
              //       <MaterialIcons
              //         name={'more-vert'}
              //         size={28}
              //         color={COLORS.neutral.normal}
              //         style={{
              //           marginRight: 2,
              //         }}
              //       />
              //     }
              //     subtitle={`${playlist._count.tracks} tracks • ${playlist._count.savedBy} saves`}
              //     title={playlist.title}
              //   />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Albums;