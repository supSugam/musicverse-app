import { TouchableOpacity, View } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';
import TrackDetailsModal from './components/TrackDetailsModal';
import { ActionsEnum } from '@/utils/enums/Action';
import { MaterialIcons } from '@expo/vector-icons';

const TracksUploadZone = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuthStore((state) => state);
  const { album, setAlbum, uploadType } = useUploadStore((state) => state);
  const [trackModalVisible, setTrackModalVisible] = useState<boolean>(false);

  const isUploadTypeSingle = uploadType === 'single';

  const handleSubmit = () => {};

  const onAddTrack = () => {
    setTrackModalVisible(true);
  };

  const onModalClose = () => {
    setTrackModalVisible(false);
  };

  return (
    <Container includeNavBar navbarTitle="Upload">
      <View className="flex justify-between items-center mt-8 px-6">
        <StyledText weight="bold" size="2xl">
          {isUploadTypeSingle ? 'Upload your track here' : 'Upload tracks for'}{' '}
          {!isUploadTypeSingle && (
            <StyledText weight="extrabold" size="2xl">
              {album?.title}
            </StyledText>
          )}
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

      <TrackDetailsModal
        action={ActionsEnum.CREATE}
        visible={trackModalVisible}
        onClose={onModalClose}
      />

      <TouchableOpacity
        onPress={onAddTrack}
        activeOpacity={0.8}
        style={{ marginVertical: 20 }}
      >
        <LinearGradient
          colors={[
            COLORS.neutral.black,
            COLORS.neutral.dark,
            COLORS.neutral.dense,
          ]}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: `${COLORS.neutral.light}60`,
            borderRadius: 6,
            padding: 20,
            width: '80%',
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="add" size={28} color="white" />
          <StyledText size="2xl" weight="bold" className="text-center mt-3">
            Add Track
          </StyledText>
          <StyledText size="sm" weight="medium" className="text-center mt-1">
            {isUploadTypeSingle
              ? 'Add your track to the platform'
              : 'Add a track to the album'}
          </StyledText>
        </LinearGradient>
      </TouchableOpacity>

      <View className="flex flex-col px-4 mt-4 w-full">
        <StyledButton
          variant="primary"
          className="mt-16"
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
