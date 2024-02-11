import { View } from 'react-native';
import { useState } from 'react';
import Container from '@/components/Container';
import StyledText from '@/components/reusables/StyledText';
import StyledButton from '@/components/reusables/StyledButton';
import { useUploadStore } from '@/services/zustand/stores/useUploadStore';

import useDatePicker from '@/hooks/useDatePicker';
import SelectOption from '@/components/reusables/SelectOption';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import { useTagsQuery } from '@/hooks/react-query/useTagsQuery';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { UserRole } from '@/utils/enums/IUser';
const TracksUploadZone = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuthStore((state) => state);
  const { album, setAlbum, uploadType } = useUploadStore((state) => state);

  const isUploadTypeSingle = uploadType === 'single';

  const handleSubmit = () => {};

  return (
    <Container includeNavBar navbarTitle="Upload">
      <View className="flex justify-between items-center mt-8 px-6">
        <StyledText weight="bold" size="2xl">
          {isUploadTypeSingle
            ? 'Upload your track here'
            : `Upload tracks for ${(
                <StyledText weight="extrabold" size="2xl">
                  {album?.title}
                </StyledText>
              )}`}
        </StyledText>
        <StyledText
          weight="extralight"
          size="xs"
          className="mt-2 text-gray-400 text-center"
          uppercase
        >
          {isUploadTypeSingle
            ? 'Make sure the track is not sized more than'
            : 'Make sure each of the tracks are sized not more than'}{' '}
          {currentUser?.role === UserRole.ARTIST ||
          currentUser?.role === UserRole.MEMBER
            ? '200MB'
            : '20MB'}
          . Only MP3 and WAV files are allowed.
        </StyledText>
      </View>

      <View className="flex flex-col px-4 mt-4 w-full">
        <StyledButton
          variant="primary"
          className="mt-8"
          fullWidth
          loading={loading}
          onPress={handleSubmit}
        >
          <StyledText weight="bold" size="lg">
            Start Uploading
          </StyledText>
        </StyledButton>
      </View>
    </Container>
  );
};

export default TracksUploadZone;
