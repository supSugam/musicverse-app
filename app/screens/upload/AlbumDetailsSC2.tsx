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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <Container includeNavBar navbarTitle="Upload" isTabScreen>
      <ScrollView className="flex flex-1">
        <View className="flex justify-between items-center mt-8">
          <StyledText weight="extrabold" size="2xl">
            Just a few more details
          </StyledText>
          <StyledText
            weight="extralight"
            size="xs"
            className="mt-2 text-gray-400"
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
