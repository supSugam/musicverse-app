import { View, ScrollView } from 'react-native';
import React, { memo, useEffect, useMemo, useState } from 'react';
import StyledText from '../reusables/StyledText';
import SearchField from '../reusables/SearchField';
import { IMenuItemProps } from '../reusables/BottomSheetMenu/MenuItem';
import { useNavigation } from 'expo-router';
import ReusableAlert from '../reusables/ReusableAlert';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { useDownloadTrack } from '@/hooks/useDownloadTrack';
import TrackListItem from '../Tracks/TrackListItem';

const Downloads = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<Partial<ITrackDetails>>();

  const [isTrackOptionsModalVisible, setIsTrackOptionsModalVisible] =
    useState<boolean>(false);

  const { updateTracks, playATrackById } = usePlayerStore();
  const { tracks: downloadedTracks, deleteTrack } =
    useDownloadTrack(searchTerm);

  useEffect(() => {
    console.log(downloadedTracks.map((track) => track.title));
  }, [downloadedTracks]);

  const trackOptions = useMemo(() => {
    if (!selectedTrack) return [];
    let options: IMenuItemProps[] = [
      {
        label: 'Share',
        onPress: () => {},
        icon: 'share',
      },
      {
        label: 'Delete from Downloads',
        onPress: () => {
          setIsTrackOptionsModalVisible(false);
          setSelectedTrack(selectedTrack);
          setShowDeleteAlert(true);
        },
        icon: 'delete',
      },
    ];

    return options;
  }, [selectedTrack, downloadedTracks]);

  return (
    <>
      <ReusableAlert
        cancelText="Cancel"
        confirmText="Delete"
        visible={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={() => {
          if (selectedTrack?.id) {
            deleteTrack(selectedTrack.id);
          }
          setShowDeleteAlert(false);
        }}
        type="alert"
        header="Delete Track"
      >
        <StyledText size="base">
          Are you sure you want to delete this track?
        </StyledText>
      </ReusableAlert>

      <ScrollView className="flex flex-1 p-5">
        <SearchField
          onSearch={(text) => {
            setSearchTerm(text);
          }}
          placeholder="Search Tracks"
        />
        {downloadedTracks.length > 0 && (
          <View className="flex flex-col w-full overflow-visible flex-1">
            <StyledText weight="semibold" size="xl" className="my-3">
              Downloads
            </StyledText>

            <ScrollView>
              {downloadedTracks.map((track, i) => (
                <TrackListItem
                  label={i + 1}
                  key={`${track.id}downloaded`}
                  id={track.id}
                  title={track.title}
                  artistName={track.creator?.username}
                  options={trackOptions}
                  onPlayClick={() => {
                    updateTracks(downloadedTracks);
                    playATrackById(track.id);
                  }}
                  cover={track.cover}
                  duration={track.trackDuration}
                  onOptionsClick={() => {
                    setSelectedTrack(track);
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

export default Downloads;
