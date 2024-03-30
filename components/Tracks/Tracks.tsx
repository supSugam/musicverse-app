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
import MenuModal from '../reusables/BottomSheetMenu/MenuModal';
import { IMenuItemProps } from '../reusables/BottomSheetMenu/MenuItem';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import ReusableAlert from '../reusables/ReusableAlert';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import Animated from 'react-native-reanimated';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import TrackListItem from './TrackListItem';
import * as FileSystem from 'expo-file-system';
import { useDownloadTrack } from '@/hooks/useDownloadTrack';
import ProgressBar from '../reusables/ProgressBar';
const Tracks = () => {
  const navigation = useNavigation();
  const [ownedTracks, setOwnedTracks] = useState<ITrackDetails[]>([]);
  const [likedTracks, setLikedTracks] = useState<ITrackDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  const {
    getAllTracks: { data: ownedTracksData, refetch: refetchOwnedTracks },
    deleteTrackById,
  } = useTracksQuery({
    getAllTracksConfig: {
      params: {
        genre: true,
        creator: true,
        owned: true,
        search: searchTerm,
      },
    },
  });

  const {
    getAllTracks: { data: likedTracksData, refetch: refetchLikedTracks },
  } = useTracksQuery({
    getAllTracksConfig: {
      params: {
        genre: true,
        creator: true,
        liked: true,
        search: searchTerm,
      },
    },
  });

  useEffect(() => {
    const tracks = ownedTracksData?.data?.result?.items;

    if (tracks) {
      setOwnedTracks(tracks);
    }
  }, [ownedTracksData]);

  useEffect(() => {
    console.log(FileSystem.documentDirectory);
    const tracks = likedTracksData?.data?.result?.items;
    if (tracks) {
      setLikedTracks(tracks);
    }
  }, [likedTracksData]);

  const refetchAllTracks = () => {
    refetchOwnedTracks();
    refetchLikedTracks();
  };

  const getTrackOptions = (trackId?: string): IMenuItemProps[] => {
    const track = [...ownedTracks, ...likedTracks].find(
      (track) => track.id === trackId
    );

    if (!track || !trackId) return [];
    let options: IMenuItemProps[] = [
      {
        label: 'Share',
        onPress: () => {},
        icon: 'share',
      },
    ];
    const downloaded = isTrackDownloaded(trackId);

    if (downloaded) {
      options.push({
        label: 'Delete from Downloads',
        onPress: () => {
          setIsTrackOptionsModalVisible(false);
          deleteTrack(trackId);
        },
        icon: 'delete',
      });
    } else {
      options.push({
        label: 'Download',
        onPress: () => {
          downloadAndSaveTrack(track);
          setIsTrackOptionsModalVisible(false);
        },
        icon: 'download',
      });
    }

    switch (selectedTrack?.type) {
      case 'owned':
        options.push({
          label: 'Update Track',
          onPress: () => {
            setIsTrackOptionsModalVisible(false);
            navigation.dispatch(
              CommonActions.navigate('UpdateTrack', {
                id: trackId,
              })
            );
          },
          icon: 'edit',
        });
        options.push({
          label: 'Delete',
          onPress: () => {
            setIsTrackOptionsModalVisible(false);
            setShowDeleteAlert(true);
          },
          icon: 'delete',
        });
        break;

      case 'liked':
        options.push({
          label: 'Unlike',
          onPress: () => {},
          icon: 'favorite-border',
        });
        break;
    }

    return options;
  };

  const [selectedTrack, setSelectedTrack] = useState<{
    track: ITrackDetails;
    type: 'owned' | 'liked';
  }>();
  const [isTrackOptionsModalVisible, setIsTrackOptionsModalVisible] =
    useState<boolean>(false);

  const { updateTracks, playATrackById } = usePlayerStore();
  const {
    downloadAndSaveTrack,
    progressPercentage,
    tracks: downloadedTracks,
    isTrackDownloaded,
    deleteTrack,
  } = useDownloadTrack();

  useEffect(() => {
    console.log(
      'downloadedTracks',
      downloadedTracks.map((track) => track.src)
    );
  }, [downloadedTracks]);

  return (
    <>
      <ReusableAlert
        cancelText="Cancel"
        confirmText="Delete"
        visible={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={() => {
          const id = selectedTrack?.track.id;
          if (id) deleteTrackById.mutate(id);
          setShowDeleteAlert(false);
        }}
        type="alert"
        header="Delete Track"
      >
        <StyledText size="base">
          Are you sure you want to delete this track?
        </StyledText>
      </ReusableAlert>
      {/* <MenuModal
          visible={isTrackOptionsModalVisible}
          onClose={() => setIsTrackOptionsModalVisible(false)}
          items={getTrackOptions(selectedTrack?.track.id)}
          header={selectedTrack?.track.title}
        /> */}

      <ScrollView
        className="flex flex-1 p-5"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetchAllTracks} />
        }
      >
        <ProgressBar progress={progressPercentage} className="w-full" />
        <SearchField
          onSearch={(text) => {
            setSearchTerm(text);
          }}
          placeholder="Search Tracks"
        />
        {ownedTracks.length > 0 && (
          <View className="flex flex-col w-full overflow-visible flex-1">
            <StyledText weight="semibold" size="xl" className="my-3">
              Your Tracks
            </StyledText>

            <ScrollView>
              {ownedTracks.map((track, i) => (
                <TrackListItem
                  label={i + 1}
                  key={`${track.id}owned`}
                  id={track.id}
                  title={track.title}
                  artistName={track.creator?.username}
                  options={getTrackOptions(track.id)}
                  onPlayClick={() => {
                    updateTracks(ownedTracks);
                    playATrackById(track.id);
                  }}
                  cover={track.cover}
                  duration={track.trackDuration}
                  onOptionsClick={() => {
                    setSelectedTrack({ track, type: 'owned' });
                    setIsTrackOptionsModalVisible(true);
                  }}
                />
              ))}
              {likedTracks.map((track, i) => (
                <TrackListItem
                  label={i + 1}
                  key={`${track.id}liked`}
                  id={track.id}
                  title={track.title}
                  artistName={track.creator?.username}
                  options={getTrackOptions(track.id)}
                  onPlayClick={() => {
                    updateTracks(likedTracks);
                    playATrackById(track.id);
                  }}
                  cover={track.cover}
                  duration={track.trackDuration}
                  onOptionsClick={() => {
                    setSelectedTrack({ track, type: 'liked' });
                    setIsTrackOptionsModalVisible(true);
                  }}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Tracks;