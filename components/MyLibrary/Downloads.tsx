import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import StyledText from '../reusables/StyledText';
import SearchField from '../reusables/SearchField';
import { IMenuItemProps } from '../reusables/BottomSheetMenu/MenuItem';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import ReusableAlert from '../reusables/ReusableAlert';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { useDownloadTrack } from '@/hooks/useDownloadTrack';
import ProgressBar from '../reusables/ProgressBar';
import TrackListItem from '../Tracks/TrackListItem';

const Downloads = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const getTrackOptions = (trackId?: string): IMenuItemProps[] => {
    const track = downloadedTracks.find((t) => t.id === trackId);

    if (!track || !trackId) return [];
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
          setSelectedTrackId(trackId);
          setShowDeleteAlert(true);
        },
        icon: 'delete',
      },
    ];

    return options;
  };

  const [isTrackOptionsModalVisible, setIsTrackOptionsModalVisible] =
    useState<boolean>(false);

  const { updateTracks, playATrackById } = usePlayerStore();
  const {
    downloadAndSaveTrack,
    progressPercentage,
    tracks: downloadedTracks,
    isTrackDownloaded,
    deleteTrack,
  } = useDownloadTrack(searchTerm);

  return (
    <>
      <ReusableAlert
        cancelText="Cancel"
        confirmText="Delete"
        visible={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={() => {
          if (selectedTrackId) deleteTrack(selectedTrackId);
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

      <ScrollView className="flex flex-1 p-5">
        <ProgressBar progress={progressPercentage} className="w-full" />
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
                  options={getTrackOptions(track.id)}
                  onPlayClick={() => {
                    updateTracks(downloadedTracks);
                    playATrackById(track.id);
                  }}
                  cover={track.cover}
                  duration={track.trackDuration}
                  onOptionsClick={() => {
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
