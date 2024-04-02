import { ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import { StyledButton } from '../reusables/StyledButton';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';
import { useRoute } from '@react-navigation/native';
import TrackPreview from '../Tracks/TrackPreview';
import LoadingIcon from '../global/LoadingIcon';
import { useAlbumsQuery } from '@/hooks/react-query/useAlbumsQuery';
import { useNavigation } from 'expo-router';
import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import StyledTextField from '../reusables/StyledTextInput';
import ImageDisplay from '../reusables/ImageDisplay';
import { useImagePicker } from '@/hooks/useImagePicker';
import { parseStringToNullUndefined } from '@/utils/helpers/string';
import { imageAssetToFile } from '@/utils/helpers/file';
import { cleanArray, convertObjectToFormData } from '@/utils/helpers/Object';
import { useTagsQuery } from '@/hooks/react-query/useTagsQuery';
import SelectOption from '../reusables/SelectOption';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReusableAlert from '../reusables/ReusableAlert';

const albumUpdateSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup
    .string()
    .nullable()
    .min(10, 'Description must be empty or at least 10 characters')
    .transform((value, originalValue) => originalValue || null),
});

const UpdateAlbum = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [album, setAlbum] = useState<IAlbumDetails | undefined>();
  const [albumCoverSource, setAlbumCoverSource] = useState<string | null>(null);
  const [deleteTrackId, setDeleteTrackId] = useState<string | null>(null);

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
    resolver: yupResolver(albumUpdateSchema),
    mode: 'onChange',
  });

  const {
    updateAlbum,
    getAlbumById: { data: albumData, isLoading: isAlbumLoading },
    deleteAlbumById,
  } = useAlbumsQuery({
    id: (params as any)?.id as string,
    getAllAlbumsConfig: {
      params: {
        tracks: true,
        tags: true,
      },
    },
  });

  useEffect(() => {
    if (albumData) {
      const album = albumData?.data?.result;
      setAlbum(album);
      setAlbumCoverSource(album?.cover);
      setValue('title', album?.title);
      setValue('description', parseStringToNullUndefined(album?.description));
    }
  }, [albumData]);

  // useEffect(() => {
  //   const album = albumData?.data;
  //   if (album) {
  //     setAlbum(album);
  //   }
  // }, [albumData]);

  const onSaveClick = async (data: any) => {
    if (!album) return;
    setLoading(true);
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
      if (!albumCoverSource && album.cover) {
        payload['deleteCover'] = true;
      }
    }
    const formPayload = convertObjectToFormData(payload) as FormData;

    await updateAlbum.mutateAsync(formPayload);

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
    <>
      <ReusableAlert
        cancelText="Cancel"
        confirmText="Delete"
        visible={deleteTrackId !== null}
        onClose={() => setDeleteTrackId(null)}
        onConfirm={async () => {
          const trackId = deleteTrackId;
          if (trackId) {
            await deleteAlbumById.mutateAsync(trackId);
          }
        }}
        type="alert"
        header="Delete Track"
      >
        <StyledText size="base">
          Are you sure you want to delete this track?
        </StyledText>
      </ReusableAlert>
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
            {/* Album Info */}

            <View className="flex flex-col w-full items-center justify-center">
              <StyledTextField
                control={control}
                controllerName="title"
                variant="underlined"
                textAlign="center"
                textSize="lg"
                fontWeight="bold"
                errorMessage={errors.title?.message}
              />
              <ImageDisplay
                source={
                  newCover?.[0]
                    ? { uri: newCover[0].uri }
                    : albumCoverSource
                    ? { uri: albumCoverSource }
                    : null
                }
                placeholder="Select Album Cover"
                width={150}
                height={150}
                onPress={pickImage}
                onDelete={() => {
                  setAlbumCoverSource(null);
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
                placeholder="Description of the album.."
                numberOfLines={2}
                errorMessage={errors.description?.message}
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
              {album?.tracks?.map((track) => (
                <TrackPreview
                  cover={track.cover}
                  title={track.title}
                  artistName={
                    track.creator?.profile?.name ||
                    track.creator?.username ||
                    ''
                  }
                  key={`album-track-${track.id}`}
                  id={track.id}
                  duration={track.trackDuration}
                  rightComponent={
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setDeleteTrackId(track.id);
                      }}
                    >
                      <MaterialIcons
                        name={'delete'}
                        size={28}
                        color={COLORS.neutral.light}
                        style={{
                          marginRight: 2,
                        }}
                      />
                    </TouchableOpacity>
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
    </>
  );
};

export default UpdateAlbum;
