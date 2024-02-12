import ModalWrapper from '@/components/reusables/ModalWrapper';
import SelectOption from '@/components/reusables/SelectOption';
import StyledButton from '@/components/reusables/StyledButton';
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
import { Modal, ScrollView, StyleSheet } from 'react-native';
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

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup
    .string()
    .nullable()
    .min(50, 'No Description or must be atleast 50 characters'),
  lyrics: yup.string().nullable(),
});

interface TrackDetailsModalProps {
  action?: ActionsEnum;
  visible: boolean;
  onClose: () => void;
}

const TrackDetailsModal = ({
  action = ActionsEnum.CREATE,
  visible,
  onClose,
}: TrackDetailsModalProps) => {
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

  const { pickAssets } = useAssetsPicker({});
  const [trackSource, setTrackSource] = useState<AssetWithDuration | null>(
    null
  );
  const [trackPreview, setTrackPreview] = useState<AssetWithDuration | null>(
    null
  );
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { genres } = useGenreQuery();
  const { tags } = useTagsQuery();
  const handleSubmitTrack = () => {
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
      console.log('bro');
      return;
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
      onClose={onClose}
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
              <StyledButton
                className="mt-4"
                onPress={async () => {
                  const file = await pickAssets();
                  setTrackSource(file?.[0] ?? null);
                }}
                variant="secondary"
                fullWidth
              >
                <StyledText weight="bold" size="xl" uppercase>
                  Select your track
                </StyledText>
              </StyledButton>
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
              <StyledButton
                className="mt-4"
                onPress={async () => {
                  const file = await pickAssets();
                  setTrackPreview(file?.[0] ?? null);
                }}
                variant="secondary"
                fullWidth
              >
                <StyledText weight="bold" size="xl" uppercase>
                  Select your track preview
                </StyledText>
              </StyledButton>
            )}
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
            />
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
            />
            <StyledTextField
              variant="default"
              control={control}
              rules={{ required: true }}
              controllerName="desc"
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
            />

            <SelectOption
              options={tags.map((tag) => tag.name)}
              placeholder="Select Tags"
              selected={selectedTags}
              onChange={onSelectedTagsChange}
              single
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
