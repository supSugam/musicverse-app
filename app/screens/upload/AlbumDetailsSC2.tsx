import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Container from '@/components/Container';
import StyledText from '@/components/reusables/StyledText';
import StyledButton from '@/components/reusables/StyledButton';
import { useUploadStore } from '@/services/zustand/stores/useUploadStore';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useDatePicker from '@/hooks/useDatePicker';
import SelectOptionsModal from '@/components/reusables/SelectOption';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import { useTagsQuery } from '@/hooks/react-query/useTagsQuery';
const schema = yup.object().shape({});
const AlbumDetailsSC2 = () => {
  const { setAlbum } = useUploadStore((state) => state);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    date,
    showDatePicker,
    hideDatePicker,
    renderDatePicker,
    formattedDate,
  } = useDatePicker();

  const handlePress = () => {};

  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const onSelectedGenreChange = (selected: string[]) => {
    setSelectedGenre(selected as string[]);
  };

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const onSelectedTagsChange = (selected: string[]) => {
    setSelectedTags(selected as string[]);
  };

  const { genres } = useGenreQuery();
  const { tags } = useTagsQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <Container includeNavBar navbarTitle="Upload">
      <ScrollView className="flex flex-1">
        <View className="flex justify-between items-center mt-8 px-6">
          <StyledText weight="extrabold" size="2xl">
            Just a few more details
          </StyledText>
          <StyledText
            weight="extralight"
            size="xs"
            className="mt-2 text-gray-400 text-center"
            uppercase
          >
            This is 2nd and last step of filling in the details of your album
          </StyledText>
        </View>

        <View className="flex flex-col px-4 mt-4 w-full">
          <StyledText
            weight="bold"
            size="lg"
            className="border-b w-full text-center my-3 pb-2"
            onPress={showDatePicker}
            style={{
              borderColor: '#ffffff60',
            }}
          >
            {`Date of Release: ${formattedDate}`}
          </StyledText>

          {renderDatePicker()}

          <SelectOptionsModal
            options={genres.map((genre) => genre.name)}
            placeholder="Select Genre"
            selected={selectedGenre}
            onChange={onSelectedGenreChange}
            single
            minSelection={1}
            maxSelection={1}
          />

          <SelectOptionsModal
            options={tags.map((tag) => tag.name)}
            placeholder="Select Tags (Optional, Max 3)"
            selected={selectedTags}
            onChange={onSelectedTagsChange}
            minSelection={0}
            maxSelection={3}
            single={false}
          />

          <StyledButton
            variant="primary"
            className="mt-8"
            fullWidth
            loading={loading}
            onPress={handleSubmit(handlePress)}
          >
            <StyledText weight="bold" size="lg">
              Continue
            </StyledText>
          </StyledButton>
        </View>
      </ScrollView>
    </Container>
  );
};

export default AlbumDetailsSC2;
