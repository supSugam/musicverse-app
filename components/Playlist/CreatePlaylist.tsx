import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import StyledText from '@/components/reusables/StyledText';
import { StyledButton } from '@/components/reusables/StyledButton';
import StyledTextField from '@/components/reusables/StyledTextInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useImagePicker } from '@/hooks/useImagePicker';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import { useTagsQuery } from '@/hooks/react-query/useTagsQuery';
import SelectOption from '../reusables/SelectOption';
import COLORS from '@/constants/Colors';
import { usePlaylistsQuery } from '@/hooks/react-query/usePlaylistsQuery';
import { imageAssetToFile } from '@/utils/helpers/file';
import { toastResponseMessage } from '@/utils/toast';
import { useNavigation } from 'expo-router';
import { convertObjectToFormData } from '@/utils/helpers/Object';

const schema = yup.object().shape({
  title: yup.string().required('Playlist Name is Required'),
  description: yup
    .string()
    .nullable()
    .min(10, 'Description empty or must be at least 10 characters')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
});
const CreatePlaylist = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { createPlaylist } = usePlaylistsQuery({});
  const navigation = useNavigation();

  const handlePress = async (data: any) => {
    setLoading(true);
    const playlistTags = selectedTags.flatMap((tag) => {
      const tagId = tags.find((t) => t.name === tag)?.id;
      return tagId ? [tagId] : [];
    });

    const coverFile = imageAssetToFile(image?.[0]);

    // TODO: public status
    const payload = convertObjectToFormData({
      title: data.title,
      description: data.description,
      tags: playlistTags,
      cover: coverFile,
    });

    await createPlaylist
      .mutateAsync(payload, {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (error) => {
          toastResponseMessage({
            content: error,
            type: 'error',
          });
        },
      })
      .finally(() => setLoading(false));
  };

  const { pickImage, image, deleteAllImages, reselectImage } = useImagePicker({
    selectionLimit: 1,
    allowsEditing: false,
  });
  const { tags } = useTagsQuery();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const onSelectedTagsChange = (selected: string[]) => {
    setSelectedTags(selected as string[]);
  };
  useEffect(() => {
    setFocus('title');
    Keyboard.dismiss();
  }, []);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return (
    <View
      className="flex relative"
      style={{
        backgroundColor: COLORS.neutral.dark,
        borderRadius: 16,
        maxHeight: '90%',
        minHeight: '40%',
      }}
    >
      <View className="flex justify-between items-center mt-8">
        <StyledText weight="extrabold" size="2xl">
          Enter Playlist Details
        </StyledText>
        <StyledText
          weight="extralight"
          size="xs"
          className="mt-2 text-gray-400"
          uppercase
        >
          Fill in the details of your playlist
        </StyledText>
      </View>

      <View className="flex flex-col px-4 mt-4 w-full">
        <StyledTextField
          variant="underlined"
          control={control}
          rules={{ required: true }}
          controllerName="title"
          placeholder="Enter Album Name"
          fontWeight="extrabold"
          textSize="xl"
          textAlign="center"
          errorMessage={errors.title?.message}
          autoCapitalize="words"
          wrapperClassName="my-2 mb-8"
        />
        <ImageDisplay
          source={image?.[0]}
          placeholder="Select Playlist Cover"
          width={164}
          height={164}
          onPress={pickImage}
          onEdit={reselectImage}
          onDelete={deleteAllImages}
          bordered
          shadows
        />
        <StyledTextField
          variant="default"
          control={control}
          rules={{ required: true }}
          controllerName="description"
          placeholder="Enter Description"
          fontWeight="normal"
          textSize="base"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          errorMessage={errors.description?.message}
          wrapperClassName="my-2 mt-8"
          backgroundColor="transparent"
          borderColor="#ffffff60"
          autoCapitalize="sentences"
        />
        <SelectOption
          options={tags.map((tag) => tag.name)}
          placeholder="Select Tags (Optional, Max 3)"
          selected={selectedTags}
          onChange={onSelectedTagsChange}
          minSelection={0}
          maxSelection={3}
        />
        <StyledButton
          variant="primary"
          fullWidth
          loading={loading}
          onPress={handleSubmit(handlePress)}
          className="mt-4 mb-2"
        >
          <StyledText weight="bold" size="lg">
            Create
          </StyledText>
        </StyledButton>
      </View>
    </View>
  );
};

export default CreatePlaylist;
