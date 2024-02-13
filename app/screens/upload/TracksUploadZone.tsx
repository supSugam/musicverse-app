import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Container from '@/components/Container';
import StyledText from '@/components/reusables/StyledText';
import { StyledButton } from '@/components/reusables/StyledButton';
import { useUploadStore } from '@/services/zustand/stores/useUploadStore';

import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { UserRole } from '@/utils/enums/IUser';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';
import TrackDetailsModal from './components/TrackDetailsModal';
import { ActionsEnum } from '@/utils/enums/Action';
import { MaterialIcons } from '@expo/vector-icons';
import AudioDetailsCard from './components/AudioDetailsCard';
import {
  extractExtension,
  formatBytes,
  formatDuration,
} from '@/utils/helpers/string';

const TracksUploadZone = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuthStore((state) => state);
  const { album, setAlbum, uploadType, track, removeTrack } = useUploadStore(
    (state) => state
  );
  const [trackModalVisible, setTrackModalVisible] = useState<boolean>(false);

  const isUploadTypeSingle = uploadType === 'single';

  const handleSubmit = () => {};

  const onAddTrack = () => {
    if (isUploadTypeSingle && track !== null) {
      toastResponseMessage({
        content: 'You can only upload one track at a time',
        type: 'error',
      });
      return;
    }
    setTrackModalVisible(true);
  };

  const onModalClose = () => {
    setTrackModalVisible(false);
  };

  return (
    <Container includeNavBar navbarTitle="Upload">
      <View className="flex-1 justify-center items-center">
        <View className="flex justify-between items-center mt-12 px-6">
          <StyledText weight="bold" size="2xl">
            {isUploadTypeSingle
              ? 'Upload your track here'
              : 'Upload tracks for'}{' '}
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
          // action={ActionsEnum.CREATE}
          visible={trackModalVisible}
          onClose={onModalClose}
        />

        <TouchableOpacity
          onPress={onAddTrack}
          activeOpacity={0.8}
          style={{ marginVertical: 20 }}
          disabled={loading}
          className="mt-12"
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
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="add-box" size={28} color="white" />
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
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: 200,
            borderRadius: 6,
            marginHorizontal: 24,
            padding: 10,
            backgroundColor: COLORS.neutral.dark,
            flex: 1,
            marginTop: 20,
          }}
          showsVerticalScrollIndicator
          className="w-full"
        >
          {!isUploadTypeSingle &&
            album?.tracks?.length &&
            album?.tracks?.map((track, index) => (
              <AudioDetailsCard
                key={index}
                title={track.title}
                size={formatBytes(track.trackSource.size)}
                duration={formatDuration(track.trackSource.duration, true)}
                extension={extractExtension(track.trackSource.file?.name)}
                onEdit={() => {}}
                onRemove={() => {}}
              />
            ))}
          {isUploadTypeSingle && track && (
            <AudioDetailsCard
              title={track.title}
              size={formatBytes(track.trackSource.size)}
              duration={formatDuration(track.trackSource.duration, true)}
              extension={extractExtension(track.trackSource.file?.name)}
              onEdit={() => {}}
              onRemove={() => {
                removeTrack();
                toastResponseMessage({
                  content: 'Track removed successfully',
                  type: 'success',
                });
              }}
            />
          )}
        </ScrollView>
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
      </View>
    </Container>
  );
};

export default TracksUploadZone;
