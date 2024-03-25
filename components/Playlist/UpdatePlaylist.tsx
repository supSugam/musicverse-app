import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import { StyledButton } from '../reusables/StyledButton';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import { CommonActions, useRoute } from '@react-navigation/native';
import TrackPreview from '../Tracks/TrackPreview';
import LoadingIcon from '../global/LoadingIcon';
import { usePlaylistsQuery } from '@/hooks/react-query/usePlaylistsQuery';
import { useNavigation } from 'expo-router';
import { IPlaylistDetails } from '@/utils/Interfaces/IPlaylist';
import { toastResponseMessage } from '@/utils/toast';
import SelectedTouchable from '../reusables/SelectedTouchable';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import StyledTextField from '../reusables/StyledTextInput';
import ImageDisplay from '../reusables/ImageDisplay';
import { useImagePicker } from '@/hooks/useImagePicker';
import { parseStringToNullUndefined } from '@/utils/helpers/string';
import { imageAssetToFile } from '@/utils/helpers/file';
import { getObjectAsFormData } from '@/utils/helpers/ts-utilities';
import { cleanArray, convertObjectToFormData } from '@/utils/helpers/Object';
import { useTagsQuery } from '@/hooks/react-query/useTagsQuery';
import SelectOption from '../reusables/SelectOption';

const playlistUpdateSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup
    .string()
    .nullable()
    .min(10, 'Description must be empty or at least 10 characters')
    .transform((value, originalValue) => originalValue || null),
});

const UpdatePlaylist = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<IPlaylistDetails | undefined>();
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [playlistCoverSource, setPlaylistCoverSource] = useState<string | null>(
    null
  );

  // Tags
  const { tags } = useTagsQuery();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const onSelectedTagsChange = (selected: string[]) => {
    setSelectedTags(selected);
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(playlistUpdateSchema),
    mode: 'onChange',
  });

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
        tags: true,
      },
    },
  });

  useEffect(() => {
    if (playlistData) {
      const playlist = playlistData?.data?.result;
      setPlaylist(playlist);
      setPlaylistCoverSource(playlist?.cover);
      setValue('title', playlist?.title);
      setValue(
        'description',
        parseStringToNullUndefined(playlist?.description)
      );
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

  const onSaveClick = async (data: any) => {
    if (!playlist) return;
    setLoading(true);
    const tracksToRemove = playlist.tracks?.filter(
      (track) => !selectedTracks.includes(track.id)
    );
    const updatedTags = cleanArray(
      selectedTags.map((t) => tags.find((tag) => tag.id === t)?.id)
    );
    const payload = {
      title: data.title,
      description: data.description,
      ...(updatedTags && { tags: updatedTags }),
    } as any;

    if (newCover?.length) {
      const cover = imageAssetToFile(newCover[0]);
      payload['cover'] = cover;
    } else {
      if (!playlistCoverSource && playlist.cover) {
        payload['deleteCover'] = true;
      }
    }
    const formPayload = convertObjectToFormData(payload) as FormData;

    if (tracksToRemove?.length) {
      await removeTracksFromPlaylist.mutateAsync(
        {
          playlistId: playlist.id,
          tracks: tracksToRemove.map((track) => track.id),
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
    await updatePlaylist.mutateAsync(formPayload);

    setLoading(false);
    navigation.goBack();
  };

  //Image Picker

  const {
    pickImage,
    deleteAllImages,
    image: newCover,
  } = useImagePicker({
    selectionLimit: 1,
    allowsEditing: true,
    aspect: [1, 1],
  });

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
          {/* Playlist Info */}

          <View className="flex flex-col w-full items-center justify-center">
            <StyledTextField
              control={control}
              controllerName="title"
              variant="underlined"
              textAlign="center"
              textSize="lg"
              fontWeight="bold"
            />
            <ImageDisplay
              source={
                newCover?.[0]
                  ? { uri: newCover[0].uri }
                  : playlistCoverSource
                  ? { uri: playlistCoverSource }
                  : null
              }
              placeholder="Select Album Cover"
              width={150}
              height={150}
              onPress={pickImage}
              onDelete={() => {
                setPlaylistCoverSource(null);
                deleteAllImages();
              }}
              onEdit={pickImage}
              onUndoChanges={deleteAllImages}
              bordered
              shadows
              className="my-6"
            />
            <StyledTextField
              control={control}
              controllerName="description"
              variant="default"
              placeholder="Description of the playlist.."
              numberOfLines={2}
            />
          </View>
          <View className="w-full">
            <SelectOption
              options={tags.map((tag) => tag.name)}
              placeholder="Select Tags (Optional, Max 3)"
              selected={selectedTags}
              onChange={onSelectedTagsChange}
              minSelection={0}
              maxSelection={3}
            />
          </View>
          <ScrollView
            className="flex flex-col"
            style={{
              maxHeight: 250,
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
                key={`playlist-track-${track.id}`}
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
          <StyledButton
            onPress={handleSubmit(onSaveClick)}
            className="w-full my-2"
            loading={loading}
          >
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
