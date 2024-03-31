import { View, ScrollView, TouchableOpacity } from 'react-native';
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
import TrackPreview from '../Tracks/TrackPreview';
import Animated from 'react-native-reanimated';
import PlayButton from '../reusables/PlayButton';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import MenuModal from '../reusables/BottomSheetMenu/MenuModal';
import SelectedTouchable from '../reusables/SelectedTouchable';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import { StyledButton } from '../reusables/StyledButton';

const Downloads = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<Partial<ITrackDetails>>();

  const [isTrackOptionsModalVisible, setIsTrackOptionsModalVisible] =
    useState<boolean>(false);

  const { updateTracks, playATrackById } = usePlayerStore();
  const {
    tracks: downloadedTracks,
    deleteTrack,
    deleteAllTracks,
  } = useDownloadTrack(searchTerm);

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

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
      <MenuModal
        onClose={() => setIsTrackOptionsModalVisible(false)}
        items={trackOptions}
        visible={isTrackOptionsModalVisible}
        header="Track Options"
      />

      <ReusableAlert
        cancelText="Cancel"
        confirmText="Delete"
        visible={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={() => {
          if (selectedTracks.length > 0) {
            deleteAllTracks(selectedTracks);
          } else {
            selectedTrack?.id && deleteTrack(selectedTrack?.id);
          }
          setShowDeleteAlert(false);
        }}
        type="alert"
        header="Delete Track"
      >
        <StyledText size="base">
          Are you sure you want to delete{' '}
          {selectedTracks.length > 0 ? 'these tracks?' : 'this track?'}
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
            <View className="flex justify-between items-center w-full flex-row">
              <StyledText weight="semibold" size="xl" className="my-3">
                Downloads
              </StyledText>
              <AnimatedTouchable
                onPress={() => {
                  if (selectedTracks.length > 0) {
                    setSelectedTracks([]);
                  } else {
                    setSelectedTracks(downloadedTracks.map((t) => t.id));
                  }
                }}
                wrapperStyles={{
                  flexDirection: 'row',
                }}
              >
                <StyledText weight="semibold" size="lg" className="mr-2">
                  {selectedTracks.length > 0
                    ? `${selectedTracks.length} Selected`
                    : `Select All`}
                </StyledText>

                <SelectedTouchable
                  selected={downloadedTracks.length === selectedTracks.length}
                />
              </AnimatedTouchable>
            </View>

            <ScrollView
              style={{
                maxHeight: 350,
                height: 350,
              }}
            >
              {downloadedTracks.map((track, i) => (
                <TrackPreview
                  onPress={() => {
                    if (selectedTracks.length > 0) {
                      if (selectedTracks.includes(track.id)) {
                        setSelectedTracks(
                          selectedTracks.filter((t) => t !== track.id)
                        );
                      } else {
                        setSelectedTracks([...selectedTracks, track.id]);
                      }
                    }
                  }}
                  onLongPress={() => {
                    if (selectedTracks.includes(track.id)) {
                      setSelectedTracks(
                        selectedTracks.filter((t) => t !== track.id)
                      );
                    } else {
                      setSelectedTracks([...selectedTracks, track.id]);
                    }
                  }}
                  key={`${track.id}downloaded`}
                  id={track.id}
                  title={track.title}
                  artistName={track.creator?.username}
                  cover={track.cover}
                  duration={track.trackDuration}
                  onPlayClick={() => {
                    updateTracks(downloadedTracks);
                    playATrackById(track.id);
                  }}
                  rightComponent={
                    <View className="flex flex-row items-center ml-auto justify-end">
                      {selectedTracks.length > 0 ? (
                        <>
                          <SelectedTouchable
                            selected={selectedTracks.includes(track.id)}
                          />
                        </>
                      ) : (
                        <>
                          <PlayButton
                            isPlaying={false}
                            onPlayClick={() => {
                              updateTracks(downloadedTracks);
                              playATrackById(track.id);
                            }}
                          />

                          <TouchableOpacity
                            className="ml-1"
                            onPress={() => {
                              setSelectedTrack(track);
                              setIsTrackOptionsModalVisible(true);
                            }}
                          >
                            <MaterialIcons
                              name="more-vert"
                              size={24}
                              color={COLORS.neutral.light}
                            />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  }
                />
              ))}
            </ScrollView>
            {selectedTracks.length > 0 && (
              <View className="flex flex-row items-center justify-end self-end">
                <AnimatedTouchable
                  onPress={() => {
                    if (selectedTracks.length > 0) {
                      setShowDeleteAlert(true);
                    }
                  }}
                  wrapperStyles={{
                    flexDirection: 'row',
                    backgroundColor: COLORS.red.dark,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 5,
                    opacity: 0.8,
                  }}
                >
                  <StyledText weight="semibold" size="lg">
                    Delete
                  </StyledText>
                </AnimatedTouchable>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Downloads;
