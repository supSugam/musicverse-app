import ModalWrapper from '@/components/reusables/ModalWrapper';
import SelectOption from '@/components/reusables/SelectOption';
import {
  StyledButton,
  StyledTouchableOpacity,
} from '@/components/reusables/StyledButton';
import StyledText from '@/components/reusables/StyledText';
import StyledTextField from '@/components/reusables/StyledTextInput';
import COLORS from '@/constants/Colors';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import { useTagsQuery } from '@/hooks/react-query/useTagsQuery';
import { AssetWithDuration, useAssetsPicker } from '@/hooks/useAssetsPicker';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { ActionsEnum } from '@/utils/enums/Action';
import { toastResponseMessage } from '@/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { MediaType } from 'expo-media-library';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';

import * as yup from 'yup';
import AudioDetailsCard from './AudioDetailsCard';
import {
  extractExtension,
  extractFilename,
  formatBytes,
  formatDuration,
} from '@/utils/helpers/string';
import { DocumentPickerAsset } from 'expo-document-picker';
import RadioButton from '@/components/reusables/RadioButton';
import FilePicker from '@/components/reusables/FilePicker';
import * as FileSystem from 'expo-file-system';
import { useImagePicker } from '@/hooks/useImagePicker';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import { useUploadStore } from '@/services/zustand/stores/useUploadStore';
import { ITrack } from '@/utils/Interfaces/ITrack';
import { UserRole } from '@/utils/enums/IUser';
import { USER_LIMITS, USER_PERMISSIONS, uuid } from '@/utils/constants';
import Switch from '@/components/reusables/StyledSwitch';
import { ReviewStatus } from '@/utils/enums/ReviewStatus';
import { cleanObject } from '@/utils/helpers/Object';

const schema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(2, 'Title is too short'),
  description: yup
    .string()
    .nullable()
    .min(20, 'No Description or must be atleast 20 characters')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  lyrics: yup.string().nullable(),
});

interface TrackDetailsModalProps {
  // action?: ActionsEnum;
  visible: boolean;
  onClose: () => void;
}

const TrackDetailsModal = ({
  // action = ActionsEnum.CREATE,
  visible,
  onClose,
}: TrackDetailsModalProps) => {
  const {
    uploadType,
    album,
    addTrackToAlbum,
    setTrack,
    track,
    removeTrackFromAlbum,
  } = useUploadStore((state) => state);
  const { currentUser } = useAuthStore((state) => state);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const onSelectedGenreChange = (genre: string[]) => {
    setSelectedGenre([...genre]);
  };
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const onSelectedTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };
  const [is2ndStep, setIs2ndStep] = useState<boolean>(false);
  const [lyricsInputType, setLyricsInputType] = useState<
    'textfield' | 'textfile'
  >('textfield');

  const { pickAssets } = useAssetsPicker();
  const [trackSource, setTrackSource] = useState<AssetWithDuration | null>(
    null
  );
  const [trackPreview, setTrackPreview] = useState<AssetWithDuration | null>(
    null
  );
  const [lyricsSource, setLyricsSource] = useState<DocumentPickerAsset | null>(
    null
  );
  const [requestPublicUpload, setRequestPublicUpload] =
    useState<boolean>(false);

  const { pickImage, image: cover } = useImagePicker({
    selectionLimit: 1,
    allowsEditing: true,
  });

  const {
    handleSubmit,
    control,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { genres } = useGenreQuery();
  const { tags } = useTagsQuery();
  const handleSubmitTrack = async (data: any) => {
    setLoading(true);
    if (selectedGenre.length === 0) {
      toastResponseMessage({
        type: 'error',
        content: 'Please select a genre',
      });
      setLoading(false);
      return;
    }
    if (is2ndStep) {
      if (!trackSource) {
        toastResponseMessage({
          type: 'error',
          content: 'Please select a track',
        });
        setLoading(false);
        return;
      }
      if (lyricsInputType === 'textfile' && !lyricsSource) {
        toastResponseMessage({
          type: 'error',
          content: 'Please select a lyrics file',
        });
        setLoading(false);
        return;
      }
      let lyrics = data.lyrics;
      if (lyricsInputType === 'textfile' && lyricsSource) {
        try {
          lyrics = await FileSystem.readAsStringAsync(lyricsSource.uri, {
            encoding: FileSystem.EncodingType.UTF8,
          });
        } catch (error) {}
      }

      const chosenTags = tags
        .filter((tag) => selectedTags.includes(tag.name))
        .map((tag) => tag.id);
      const genre = genres.find((g) => g.name === selectedGenre[0])?.id;
      if (!genre) {
        setLoading(false);
        return;
      }

      const originalFile = cover?.[0];

      const trackDetails: ITrack = cleanObject({
        title: data.title,
        description: data.description,
        lyrics,
        genreId: genre,
        tags: chosenTags,
        src: trackSource,
        preview: trackPreview || undefined,
        publicStatus: requestPublicUpload
          ? ReviewStatus.REQUESTED
          : ReviewStatus.NOT_REQUESTED,
        trackDuration: trackSource.duration || 0,
        trackSize: trackSource.size || 0,
        previewDuration: trackPreview?.duration || 0,
        cover: originalFile,
        uploadKey: uuid(),
      });

      // TODO: Every song shall have same genre and tags as the album

      if (uploadType === 'album') {
        if (currentUser?.role !== UserRole.ARTIST) {
          toastResponseMessage({
            type: 'error',
            content: 'Only artists can upload albums',
          });
          setLoading(false);
          return;
        }
        if (album?.tracks && album?.tracks?.length === 10) {
          toastResponseMessage({
            type: 'error',
            content: 'Album can only have 10 tracks',
          });
          setLoading(false);
          return;
        }
        const response = addTrackToAlbum(trackDetails);
        toastResponseMessage(response);
        if (response.type === 'success') {
          onClose();
        }
      } else {
        if (track) {
          toastResponseMessage({
            type: 'error',
            content: 'One Track already exists',
          });
          setLoading(false);
          return;
        }
        const response = setTrack(trackDetails);
        toastResponseMessage(response);
        if (response.type === 'success') {
          onClose();
        }
        onClose();
      }
      setLoading(false);
    } else {
      setIs2ndStep(true);
      setLoading(false);
    }
  };
  return (
    <ModalWrapper
      transparent
      blur
      animationType="fade"
      visible={visible}
      header={
        <View className="flex flex-row items-center">
          {is2ndStep && (
            <MaterialIcons
              onPress={() => {
                setIs2ndStep(false);
              }}
              name="chevron-left"
              size={24}
              color={'#fff'}
            />
          )}
          <StyledText
            weight="bold"
            size="lg"
            className={is2ndStep ? 'ml-4' : ''}
          >
            {is2ndStep ? 'Step 2: Track Details' : 'Step 1: Track Details'}
          </StyledText>
          <StyledTouchableOpacity onPress={onClose} className="ml-auto">
            <StyledText weight="bold" size="lg">
              Cancel
            </StyledText>
          </StyledTouchableOpacity>
        </View>
      }
    >
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        {is2ndStep ? (
          <>
            {trackSource ? (
              <AudioDetailsCard
                duration={formatDuration(trackSource?.duration || 0, true)}
                extension={extractExtension(trackSource?.name)}
                size={formatBytes(trackSource.size)}
                onRemove={() => setTrackSource(null)}
                title={extractFilename(trackSource.name)}
              />
            ) : (
              <FilePicker
                onPress={async () => {
                  const file = await pickAssets({
                    maxFileSize: USER_LIMITS.getMaxTrackSize(currentUser?.role),
                  });
                  setTrackSource(file?.[0] ?? null);
                }}
                caption="Select your track"
                className="my-2"
              />
            )}

            {trackPreview ? (
              <AudioDetailsCard
                duration={formatDuration(trackPreview?.duration || 0, true)}
                extension={extractExtension(trackPreview?.name)}
                size={formatBytes(trackPreview.size)}
                onRemove={() => setTrackPreview(null)}
                title={extractFilename(trackPreview.name)}
              />
            ) : (
              <FilePicker
                onPress={async () => {
                  const file = await pickAssets({
                    maxFileSize: USER_LIMITS.getMaxTrackPreviewSize(
                      currentUser?.role
                    ),
                  });

                  setTrackPreview(file?.[0] ?? null);
                }}
                caption="Select preview (Optional)"
                className="mt-2"
              />
            )}

            <View className="flex flex-row items-center justify-between mt-4 mx-2">
              <RadioButton
                label="Enter Lyrics"
                onSelect={() => setLyricsInputType('textfield')}
                selected={lyricsInputType === 'textfield'}
              />
              <RadioButton
                label="Select Lyrics File"
                onSelect={() => {
                  setLyricsInputType('textfile');
                  setValue('lyrics', null);
                }}
                selected={lyricsInputType === 'textfile'}
              />
            </View>
            {lyricsInputType === 'textfile' && (
              <>
                {lyricsSource ? (
                  <AudioDetailsCard
                    duration={'-'}
                    extension={extractExtension(lyricsSource.name)}
                    size={formatBytes(lyricsSource.size)}
                    onRemove={() => setLyricsSource(null)}
                    title={extractFilename(lyricsSource.name)}
                    icon="file-present"
                  />
                ) : (
                  <FilePicker
                    onPress={async () => {
                      const file = await pickAssets({
                        mediaTypes: ['text/plain'],
                      });
                      setLyricsSource(file?.[0] ?? null);
                    }}
                    caption="Select lyrics file"
                    className="mt-2"
                  />
                )}
              </>
            )}
            {lyricsInputType === 'textfield' && (
              <StyledTextField
                variant="default"
                control={control}
                rules={{ required: true }}
                controllerName="lyrics"
                placeholder="Lyrics (Optional)"
                fontWeight="normal"
                textSize="base"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                errorMessage={errors.lyrics?.message}
                wrapperClassName="my-2 mt-4"
                borderColor={COLORS.neutral.normal}
                backgroundColor="transparent"
                autoCapitalize="sentences"
              />
            )}
            {USER_PERMISSIONS.canPublicUpload(
              currentUser?.role as UserRole
            ) && (
              <Switch
                value={requestPublicUpload}
                onToggle={setRequestPublicUpload}
                label="Request Public Upload"
                className="mt-2"
              />
            )}
          </>
        ) : (
          <>
            <StyledTextField
              placeholder="Enter track title"
              controllerName="title"
              errorMessage={errors.title?.message}
              control={control}
              variant="underlined"
              textAlign="center"
              textSize="xl"
              fontWeight="bold"
              autoCapitalize="words"
              onBlur={() => {
                setFocus('description');
              }}
            />
            <StyledTextField
              variant="default"
              control={control}
              rules={{ required: true }}
              controllerName="description"
              placeholder="Enter description"
              fontWeight="normal"
              textSize="base"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              errorMessage={errors.description?.message}
              wrapperClassName="my-2"
              backgroundColor="transparent"
              borderColor={COLORS.neutral.normal}
              autoCapitalize="sentences"
            />
            <ImageDisplay
              source={cover?.[0].uri}
              placeholder="Select Track Cover"
              width={164}
              height={164}
              onPress={pickImage}
            />

            <SelectOption
              options={tags.map((tag) => tag.name)}
              placeholder="Select Tags (Optional, Max 3)"
              selected={selectedTags}
              onChange={onSelectedTagsChange}
              minSelection={0}
              maxSelection={3}
            />
            <SelectOption
              options={genres.map((genre) => genre.name)}
              placeholder="Select Genre"
              selected={selectedGenre}
              onChange={onSelectedGenreChange}
              single
              minSelection={1}
              maxSelection={1}
            />
          </>
        )}

        <View className="my-4 w-full">
          <StyledButton
            className="mt-4"
            onPress={handleSubmit(handleSubmitTrack)}
            variant="primary"
            fullWidth
            loading={loading}
          >
            <StyledText weight="bold" size="xl" uppercase>
              {is2ndStep ? 'Submit' : 'Next'}
            </StyledText>
          </StyledButton>
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};

export default TrackDetailsModal;

const styles = StyleSheet.create({
  contentWrapper: {
    width: '100%',
  },
});
