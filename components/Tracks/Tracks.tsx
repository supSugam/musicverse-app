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
import { Skeleton, SkeletonLoader } from '../reusables/Skeleton/Skeleton';
import ListSkeleton from '../reusables/Skeleton/ListSkeleton';
const Tracks = () => {
  const navigation = useNavigation();
  const [ownedTracks, setOwnedTracks] = useState<ITrackDetails[]>([]);
  const [likedTracks, setLikedTracks] = useState<ITrackDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  const {
    getAllTracks: {
      data: ownedTracksData,
      refetch: refetchOwnedTracks,
      isLoading: isLoadingOwnedTracks,
      isRefetching: isRefetchingOwnedTracks,
    },
    deleteTrackById,
    toggleLike,
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
    getAllTracks: {
      data: likedTracksData,
      refetch: refetchLikedTracks,
      isLoading: isLoadingLikedTracks,
      isRefetching: isRefetchingLikedTracks,
    },
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
    setOwnedTracks(ownedTracksData?.data?.result?.items ?? []);
  }, [ownedTracksData]);

  useEffect(() => {
    setLikedTracks(likedTracksData?.data?.result?.items ?? []);
  }, [likedTracksData]);

  const refetchAllTracks = () => {
    refetchOwnedTracks();
    refetchLikedTracks();
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

  const trackOptions = useMemo(() => {
    if (!selectedTrack) return [];
    const trackId = selectedTrack?.track.id;
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
          setShowDeleteAlert(true);
        },
        icon: 'delete',
      });
    } else {
      options.push({
        label: 'Download',
        onPress: () => {
          setIsTrackOptionsModalVisible(false);
          downloadAndSaveTrack(trackId);
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
          onPress: () => {
            setIsTrackOptionsModalVisible(false);
            toggleLike.mutate(trackId);
          },
          icon: 'favorite-border',
        });
        break;
    }

    return options;
  }, [
    selectedTrack,
    isTrackDownloaded,
    downloadedTracks,
    downloadAndSaveTrack,
    deleteTrack,
    navigation,
  ]);

  return (
    <>
      <ReusableAlert
        cancelText="Cancel"
        confirmText="Delete"
        visible={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={() => {
          setShowDeleteAlert(false);
          const id = selectedTrack?.track.id;
          if (id) deleteTrackById.mutate(id);
        }}
        type="alert"
        header="Delete Track"
      >
        <StyledText size="base">
          Are you sure you want to delete this track?
        </StyledText>
      </ReusableAlert>

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
        <Skeleton
          isLoading={
            isRefetchingOwnedTracks ||
            isRefetchingLikedTracks ||
            isLoadingOwnedTracks ||
            isLoadingLikedTracks
          }
          skeletonComponent={
            <View className="flex flex-col w-full">
              <View className="flex flex-col w-full mb-5 mt-5">
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
          {ownedTracks.length > 0 && (
            <View className="flex flex-col w-full overflow-visible flex-1">
              <StyledText weight="semibold" size="xl" className="my-3">
                Your Tracks
              </StyledText>

              <ScrollView>
                {ownedTracks.map((track, i) => (
                  <TrackListItem
                    label={i + 1}
                    optionsVisible={isTrackOptionsModalVisible}
                    key={`${track.id}owned`}
                    id={track.id}
                    title={track.title}
                    artistName={
                      track.creator?.profile.name || track?.creator?.username
                    }
                    options={trackOptions}
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
                {likedTracks.length > 0 && (
                  <>
                    <StyledText size="xl" weight="semibold" className="my-3">
                      Liked Tracks
                    </StyledText>
                    {likedTracks.map((track, i) => (
                      <TrackListItem
                        label={i + 1}
                        key={`${track.id}liked`}
                        id={track.id}
                        title={track.title}
                        artistName={
                          track.creator?.profile.name ||
                          track?.creator?.username
                        }
                        options={trackOptions}
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
                  </>
                )}
              </ScrollView>
            </View>
          )}
        </Skeleton>
      </ScrollView>
    </>
  );
};

export default Tracks;
