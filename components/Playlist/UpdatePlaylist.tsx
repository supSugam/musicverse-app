import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import { StyledButton } from '../reusables/StyledButton';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import { CommonActions, useRoute } from '@react-navigation/native';
import TrackPreview from '../Tracks/TrackPreview';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import LoadingIcon from '../global/LoadingIcon';
import { usePlaylistsQuery } from '@/hooks/react-query/usePlaylistsQuery';
import { useNavigation } from 'expo-router';
import { IPlaylistDetails } from '@/utils/Interfaces/IPlaylist';
import PlaylistPreviewList from './PlaylistPreviewList';
import { MaterialIcons } from '@expo/vector-icons';
import SearchField from '../reusables/SearchField';
import { toastResponseMessage } from '@/utils/toast';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { consoleLogFormattedObject } from '@/utils/helpers/Object';
import TrackListItem from '../Tracks/TrackListItem';
import SelectedTouchable from '../reusables/SelectedTouchable';

const UpdatePlaylist = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<IPlaylistDetails | undefined>();
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const onTrackPress = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter((id) => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const {
    updatePlaylist,
    getPlaylistById: { data: playlistData, isLoading: isPlaylistLoading },
    removeTracksFromPlaylist,
  } = usePlaylistsQuery({
    id: (params as any)?.id as string,
    getAllPlaylistsConfig: {
      params: {
        tracks: true,
      },
    },
  });

  const {
    getAllTracks: { data: searchedTracksData, isLoading: isTracksLoading },
  } = useTracksQuery({
    getAllTracksConfig: {
      params: {
        search: searchTerm,
        pageSize: 20,
      },
    },
  });

  useEffect(() => {
    if (playlistData) {
      const playlist = playlistData?.data?.result;
      setPlaylist(playlist);
      if (playlist.tracks)
        setSelectedTracks(playlist.tracks?.map((track) => track.id));
    }
  }, [playlistData]);

  // useEffect(() => {
  //   const playlist = playlistData?.data;
  //   if (playlist) {
  //     consoleLogFormattedObject({ playlist });
  //     setPlaylist(playlist);
  //   }
  // }, [playlistData]);

  const onSaveClick = async () => {
    if (!playlist) return;
    setLoading(true);
    const tracksToRemove = playlist.tracks?.filter(
      (track) => !selectedTracks.includes(track.id)
    );
    if (tracksToRemove?.length) {
      await removeTracksFromPlaylist.mutateAsync(
        {
          playlistId: playlist.id,
          tracks: tracksToRemove.map((track) => track.id),
        },
        {
          onSuccess: () => {
            toastResponseMessage({
              content: 'Playlist Updated',
              type: 'success',
            });
          },
          onError: (error) => {
            toastResponseMessage({
              content: error,
              type: 'error',
            });
          },
        }
      );
    }
    setLoading(false);
    navigation.goBack();
  };

  return (
    <View
      className="flex relative"
      style={{
        backgroundColor: COLORS.neutral.dark,
        borderRadius: 16,
        maxHeight: '90%',
        minHeight: '40%',
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <PrimaryGradient
        opacity={0.2}
        style={{
          borderRadius: 16,
        }}
      />

      {loading ? (
        <LoadingIcon size={111} />
      ) : (
        <View className="p-4 w-full flex justify-center items-center relative">
          <View className=" w-full">
            <PlaylistPreviewList
              cover={playlist?.cover || null}
              onPress={() => {}}
              subtitle={`${playlist?._count?.tracks} tracks • ${playlist?._count?.savedBy} saves`}
              title={playlist?.title || ''}
            />
          </View>

          <SearchField
            placeholder="Search for tracks"
            onSearch={(text) => {
              setSearchTerm(text);
            }}
            triggerMode="debounce"
          />

          <ScrollView
            className="flex flex-col"
            style={{
              maxHeight: 300,
              width: '100%',
            }}
            showsVerticalScrollIndicator
          >
            {/* TODO: Change order of tracks ( not mandatory though) */}
            {playlist?.tracks?.map((track) => (
              <TrackPreview
                cover={track.cover}
                title={track.title}
                artistName={
                  track.creator?.profile?.name || track.creator?.username || ''
                }
                key={track.id}
                id={track.id}
                duration={track.trackDuration}
                onPress={() => onTrackPress(track.id)}
                rightComponent={
                  <SelectedTouchable
                    selected={selectedTracks.includes(track.id)}
                  />
                }
              />
            ))}
          </ScrollView>
          <StyledButton onPress={onSaveClick} className="w-full my-2">
            <StyledText size="xl" weight="bold" className="text-center">
              Save
            </StyledText>
          </StyledButton>
        </View>
      )}
    </View>
  );
};

export default UpdatePlaylist;
