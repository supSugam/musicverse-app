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

const UpdatePlaylist = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<IPlaylistDetails | undefined>();
  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  const {
    updatePlaylist,
    getPlaylistById: { data: playlistData, isLoading: isPlaylistLoading },
  } = usePlaylistsQuery({
    id: (params as any)?.id as string,
  });

  const onSaveClick = async () => {};

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
              subtitle={`${playlist?._count.tracks} tracks • ${playlist?._count.savedBy} saves`}
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
            }}
            showsVerticalScrollIndicator
          ></ScrollView>
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
