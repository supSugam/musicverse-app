import { ScrollView, View } from 'react-native';
import React, { useState } from 'react';
import Container from '@/components/Container';
import StyledText from '@/components/reusables/StyledText';
import { StyledButton } from '@/components/reusables/StyledButton';
import { useUploadStore } from '@/services/zustand/stores/useUploadStore';
import StyledTextField from '@/components/reusables/StyledTextInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useImagePicker } from '@/hooks/useImagePicker';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import { toastResponseMessage } from '@/utils/toast';
import { imageAssetToFile } from '@/utils/helpers/file';
const schema = yup.object().shape({
  title: yup.string().required('Album Name is Required'),
  description: yup
    .string()
    .nullable()
    .min(50, 'Description must be at least 50 characters')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
});
const AlbumDetailsSC1 = ({ navigation }: { navigation: any }) => {
  const { setAlbum } = useUploadStore((state) => state);

  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = (data: any) => {
    setLoading(true);
    const coverFile = imageAssetToFile(image?.[0]);
    setAlbum({
      title: data.title,
      description: data.description,
      ...(coverFile && { cover: coverFile }),
    });
    setLoading(false);
    navigation.navigate('AlbumDetailsSC2');
  };

  const { pickImage, image } = useImagePicker({
    selectionLimit: 1,
    allowsEditing: true,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return (
    <ScrollView className="flex-1">
      <View className="flex justify-between items-center mt-8">
        <StyledText weight="extrabold" size="2xl">
          Enter Album Details
        </StyledText>
        <StyledText
          weight="extralight"
          size="xs"
          className="mt-2 text-gray-400"
          uppercase
        >
          Fill in the details of your album
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
          source={image?.[0]?.uri}
          placeholder="Select Album Cover"
          width={164}
          height={164}
          onPress={pickImage}
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
      </View>

      <View className="flex-1 p-4">
        <StyledButton
          variant="primary"
          fullWidth
          loading={loading}
          onPress={handleSubmit(handlePress)}
          className="mt-auto mb-2"
        >
          <StyledText weight="bold" size="lg">
            Next
          </StyledText>
        </StyledButton>
      </View>
    </ScrollView>
  );
};

export default AlbumDetailsSC1;
