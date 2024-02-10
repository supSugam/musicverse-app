import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Container from '@/components/Container';
import StyledText from '@/components/reusables/StyledText';
import StyledButton from '@/components/reusables/StyledButton';
import { useUploadStore } from '@/services/zustand/stores/useUploadStore';
import StyledTextField from '@/components/reusables/StyledTextInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useImagePicker } from '@/hooks/useImagePicker';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import { toastResponseMessage } from '@/utils/toast';
import TabBarSafeView from '@/components/reusables/TabBarSafeView';
const schema = yup.object().shape({
  title: yup.string().required('Album Name is Required'),
  desc: yup
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
    toastResponseMessage({
      content: 'Redirecting to the next step...',
      type: 'success',
    });
    navigation.navigate('AlbumDetailsSC2');
    setAlbum({
      title: data.albumName,
      description: data.desc,
    });
  };

  const { pickImage, image } = useImagePicker({ selectionLimit: 1 });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return (
    <Container includeNavBar navbarTitle="Upload">
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
        />
        <ImageDisplay
          source={image}
          placeholder="Select Album Cover"
          width={164}
          height={164}
          onPress={pickImage}
          className="my-4"
        />
        <StyledTextField
          variant="default"
          control={control}
          rules={{ required: true }}
          controllerName="desc"
          placeholder="Enter Description"
          fontWeight="normal"
          textSize="base"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          errorMessage={errors.desc?.message}
        />
      </View>

      <StyledButton
        variant="primary"
        fullWidth
        loading={loading}
        onPress={handleSubmit(handlePress)}
        className="mt-auto"
      >
        <StyledText weight="bold" size="lg">
          Continue
        </StyledText>
      </StyledButton>
    </Container>
  );
};

export default AlbumDetailsSC1;
