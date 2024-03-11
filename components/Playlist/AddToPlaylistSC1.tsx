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
import StyledTextField from '../reusables/StyledTextInput';
import SearchField from '../reusables/SearchField';

const AddToPlaylistSC1 = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [track, setTrack] = useState<Partial<ITrackDetails> | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<IPlaylistDetails[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [playlistsViewHeight, setPlaylistsViewHeight] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  const isPlaylistSelected = (id: string) => {
    return selectedPlaylists.includes(id);
  };
  const onPlaylistSelectClick = (id: string) => {
    if (isPlaylistSelected(id)) {
      setSelectedPlaylists((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedPlaylists((prev) => [...prev, id]);
    }
  };

  const {
    getAllPlaylists: { data: playlists, isLoading: isPlaylistsLoading },
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
    if (playlists) {
      setUserPlaylists(playlists.data.result.items);
    }
  }, [playlists]);

  const onCreatePlaylistClick = () => {
    navigation.dispatch(CommonActions.navigate('CreatePlaylist'));
  };

  return (
    <View
      className="flex relative"
      style={{
        backgroundColor: COLORS.neutral.dark,
        borderRadius: 16,
      }}
    >
      <PrimaryGradient opacity={0.2} />

      {track ? (
        <View className="p-4 w-full flex justify-center items-center relative">
          <View className="mb-4 w-full">
            <TrackPreview
              cover={track?.cover}
              title={track?.title}
              duration={track?.trackDuration}
              id={track?.id}
              artistName={track?.creator?.username}
            />
          </View>

          <StyledButton onPress={onCreatePlaylistClick} className="w-full my-2">
            <StyledText size="xl" weight="bold" className="text-center">
              Create New Playlist
            </StyledText>
          </StyledButton>

          <StyledText
            size="base"
            weight="light"
            className="text-center my-2"
            uppercase
          >
            or
          </StyledText>

          <StyledText size="xl" weight="bold" className="text-center my-2">
            Add to Existing Playlists
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
              maxHeight: playlistsViewHeight,
            }}
          >
            {isPlaylistsLoading ? (
              <LoadingIcon size={111} />
            ) : (
              userPlaylists.map((playlist) => (
                <PlaylistPreviewList
                  cover={playlist.cover}
                  onPress={() => onPlaylistSelectClick(playlist.id)}
                  rightComponent={
                    <MaterialIcons
                      name={
                        isPlaylistSelected(playlist.id)
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
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setPlaylistsViewHeight(height * 3 + 20);
                  }}
                />
              ))
            )}
          </ScrollView>
        </View>
      ) : (
        <LoadingIcon size={111} />
      )}
    </View>
  );
};

export default AddToPlaylistSC1;

const styles = StyleSheet.create({});
