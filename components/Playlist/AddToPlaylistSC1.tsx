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
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

const AddToPlaylistSC1 = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [track, setTrack] = useState<Partial<ITrackDetails> | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<IPlaylistDetails[]>([]);
  const [selectedNewPlaylists, setSelectedNewPlaylists] = useState<string[]>(
    []
  );
  const [selectedOldPlaylists, setSelectedOldPlaylists] = useState<string[]>(
    []
  );
  const [playlistsContainingThisTrack, setPlaylistsContainingThisTrack] =
    useState<IPlaylistDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  const isNewPlaylistSelected = (id: string) => {
    return selectedNewPlaylists.includes(id);
  };
  const onNewPlaylistSelectClick = (id: string) => {
    if (isNewPlaylistSelected(id)) {
      setSelectedNewPlaylists((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedNewPlaylists((prev) => [...prev, id]);
    }
  };

  const isOldPlaylistSelected = (id: string) => {
    return selectedOldPlaylists.includes(id);
  };

  const onOldPlaylistSelectClick = (id: string) => {
    if (isOldPlaylistSelected(id)) {
      setSelectedOldPlaylists((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedOldPlaylists((prev) => [...prev, id]);
    }
  };

  const {
    getAllPlaylists: {
      data: allPlaylists,
      isLoading: isPlaylistsLoading,
      isRefetching: isPlaylistsRefetching,
    },
  } = usePlaylistsQuery({
    getAllPlaylistsConfig: {
      params: {
        tags: true,
        pageSize: 50,
        ...(searchTerm && { search: searchTerm }),
      },
      queryOptions: {
        enabled: !!track,
      },
    },
  });

  const {
    getAllPlaylists: {
      data: allPlaylistsContainingThisTrack,
      isLoading: isPlaylistsContainingThisTrackLoading,
      isRefetching: isPlaylistsContainingThisTrackRefetching,
    },
    addTrackToPlaylists,
    removeTrackFromPlaylists,
  } = usePlaylistsQuery({
    getAllPlaylistsConfig: {
      params: {
        tags: true,
        containsTrack: track?.id,
      },
      queryOptions: {
        enabled: track?.id !== undefined,
      },
    },
  });

  useEffect(() => {
    const { params: param } = params as any;
    const { track } = param;
    if (track) {
      setTrack(track);
    } else {
      setTrack(null);
    }
  }, [params]);

  useEffect(() => {
    if (allPlaylists) {
      const { items: playlists } = allPlaylists.data.result;
      setUserPlaylists(
        playlists.filter(
          (playlist) =>
            !playlistsContainingThisTrack.map((p) => p.id).includes(playlist.id)
        )
      );
    }
  }, [allPlaylists, playlistsContainingThisTrack]);

  useEffect(() => {
    if (allPlaylistsContainingThisTrack) {
      const { items: playlists } = allPlaylistsContainingThisTrack.data.result;
      setPlaylistsContainingThisTrack(playlists);
      setSelectedOldPlaylists(playlists.map((p) => p.id));
    }
  }, [allPlaylistsContainingThisTrack]);

  useEffect(() => {
    setLoading(
      isPlaylistsLoading ||
        isPlaylistsContainingThisTrackLoading ||
        isPlaylistsRefetching ||
        isPlaylistsContainingThisTrackRefetching
    );
  }, [
    isPlaylistsLoading,
    isPlaylistsContainingThisTrackLoading,
    isPlaylistsRefetching,
    isPlaylistsContainingThisTrackRefetching,
  ]);

  const onCreatePlaylistClick = () => {
    navigation.dispatch(CommonActions.navigate('CreatePlaylist'));
  };

  const onDoneClick = async () => {
    if (!track?.id) return;

    const playlistsToRemoveFrom = playlistsContainingThisTrack
      .filter((playlist) => !selectedOldPlaylists.includes(playlist.id))
      .map((p) => p.id);

    if (selectedNewPlaylists.length > 0) {
      await addTrackToPlaylists.mutateAsync(
        {
          trackId: track?.id,
          playlists: selectedNewPlaylists,
        },
        {
          onError: (error) => {
            toastResponseMessage({
              content: error,
              type: 'error',
            });
          },
        }
      );
    }

    if (playlistsToRemoveFrom.length > 0) {
      await removeTrackFromPlaylists.mutateAsync(
        {
          trackId: track?.id,
          playlists: playlistsToRemoveFrom,
        },
        {
          onError: (error) => {
            toastResponseMessage({
              content: error,
              type: 'error',
            });
          },
        }
      );
    }
    setSelectedNewPlaylists([]);

    toastResponseMessage({
      content: 'Playlists Updated',
      type: 'success',
    });
  };

  return (
    <View
      className="flex relative"
      style={{
        backgroundColor: COLORS.neutral.dark,
        borderRadius: 16,
        maxHeight: '80%',
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

      {!loading ? (
        <View className="p-4 w-full flex justify-center items-center relative">
          <View className=" w-full">
            <TrackPreview
              cover={track?.cover}
              title={track?.title}
              duration={track?.trackDuration}
              id={track?.id}
              artistName={track?.creator?.username}
            />
          </View>

          <StyledButton
            onPress={onCreatePlaylistClick}
            variant="secondary"
            fullWidth
            className="my-2 mb-4"
          >
            <StyledText size="xl" weight="bold" className="text-center">
              Create New Playlist
            </StyledText>
          </StyledButton>
          <StyledText
            size="sm"
            weight="medium"
            uppercase
            opacity="medium"
            tracking="tighter"
          >
            Or Add to Existing Playlists
          </StyledText>

          <SearchField
            placeholder="Search Playlists"
            onSearch={(text) => {
              setSearchTerm(text);
            }}
            triggerMode="debounce"
          />

          <ScrollView
            className="flex flex-col"
            style={{
              maxHeight: 300,
            }}
            showsVerticalScrollIndicator
          >
            {isPlaylistsLoading ? (
              <LoadingIcon size={111} />
            ) : (
              <>
                {playlistsContainingThisTrack.map((playlist) => (
                  <PlaylistPreviewList
                    cover={playlist.cover}
                    onPress={() => onOldPlaylistSelectClick(playlist.id)}
                    rightComponent={
                      <MaterialIcons
                        name={
                          isOldPlaylistSelected(playlist.id)
                            ? 'check-circle'
                            : 'add-circle-outline'
                        }
                        size={28}
                        color={COLORS.primary.light}
                        style={{
                          marginRight: 2,
                        }}
                      />
                    }
                    subtitle={`${playlist._count.tracks} tracks • ${playlist._count.savedBy} saves`}
                    title={playlist.title}
                  />
                ))}

                {userPlaylists.map((playlist) => (
                  <PlaylistPreviewList
                    cover={playlist.cover}
                    onPress={() => onNewPlaylistSelectClick(playlist.id)}
                    rightComponent={
                      <MaterialIcons
                        name={
                          isNewPlaylistSelected(playlist.id)
                            ? 'check-circle'
                            : 'add-circle-outline'
                        }
                        size={28}
                        color={COLORS.primary.light}
                        style={{
                          marginRight: 2,
                        }}
                      />
                    }
                    subtitle={`${playlist._count.tracks} tracks • ${playlist._count.savedBy} saves`}
                    title={playlist.title}
                  />
                ))}
              </>
            )}
          </ScrollView>
          <StyledButton onPress={onDoneClick} className="w-full my-2">
            <StyledText size="xl" weight="bold" className="text-center">
              Done
            </StyledText>
          </StyledButton>
        </View>
      ) : (
        <LoadingIcon size={111} />
      )}
    </View>
  );
};

export default AddToPlaylistSC1;

const styles = StyleSheet.create({});
