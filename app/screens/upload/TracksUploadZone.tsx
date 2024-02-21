import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
import AudioDetailsCard from './components/AudioDetailsCard';
import {
  extractExtension,
  formatBytes,
  formatDuration,
} from '@/utils/helpers/string';
import { EmptyGhostLA } from '@/assets/lottie';
import LottieView from 'lottie-react-native';
import useUploadAssets from '@/hooks/react-query/useUploadAssets';
import { useAlbumQuery } from '@/hooks/react-query/useAlbumQuery';
import { ICreateAlbumPayload } from '@/utils/Interfaces/IAlbum';
import { assetToFile, imageAssetToFile } from '@/utils/helpers/file';
import { uuid } from '@/utils/constants';
import {
  getObjectAsFormData,
  getValueFromRecordByIndex,
} from '@/utils/helpers/ts-utilities';
import { UploadStatus } from '@/utils/enums/IUploadStatus';

const TracksUploadZone = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuthStore((state) => state);
  const {
    album,
    setAlbum,
    uploadType,
    track,
    removeTrack,
    removeTrackFromAlbum,
  } = useUploadStore((state) => state);
  const [trackModalVisible, setTrackModalVisible] = useState<boolean>(false);

  const isUploadTypeSingle = uploadType === 'single';

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const {
    uploadAssets: uploadTracks,
    progressDetails,
    cancelUpload,
  } = useUploadAssets({
    endpoint: '/tracks',
    requestType: 'POST',
    payload: isUploadTypeSingle && track ? [track] : [...(album?.tracks || [])],
    multiple: !isUploadTypeSingle,
    onUploadError(error) {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
      setLoading(false);
    },
    onUploadSuccess() {
      toastResponseMessage({
        content: 'Tracks uploaded successfully',
        type: 'success',
      });
      setLoading(false);
    },
    onUploadStart() {
      setLoading(true);
    },
    onUploadCancel() {
      toastResponseMessage({
        content: 'Upload cancelled',
        type: 'error',
      });
      setLoading(false);
    },
  });
  const { create: createAlbum } = useAlbumQuery();

  useEffect(() => {
    const isUploading = Object.values(progressDetails).some(
      (upload) => upload.uploadStatus === UploadStatus.UPLOADING
    );
    setIsUploading(isUploading);
  }, [progressDetails]);

  const handleSubmit = async () => {
    switch (uploadType) {
      case 'album':
        if (!album?.tracks?.length) {
          toastResponseMessage({
            content: 'Add tracks first',
            type: 'error',
          });
          return;
        }
        const { tracks, ...rest } = album;

        const formData = getObjectAsFormData<ICreateAlbumPayload>(
          rest as ICreateAlbumPayload
        );
        await createAlbum.mutateAsync(formData, {
          onSuccess: async (data) => {
            console.log('Album created', data.data);
            toastResponseMessage({
              content: 'Album Created, Uploading tracks now...',
              type: 'success',
            });
            const albumTracksWithAlbumId = album?.tracks?.map((track) => ({
              ...track,
              albumId: data?.data?.result.id,
            }));
            await uploadTracks(albumTracksWithAlbumId);
          },
        });

        break;

      case 'single':
        if (!track) {
          toastResponseMessage({
            content: 'Add a track first',
            type: 'error',
          });
          return;
        }
        await uploadTracks();
    }
  };

  const onAddTrack = () => {
    if (isUploadTypeSingle && track !== null) {
      toastResponseMessage({
        content: 'You can only upload one track at a time',
        type: 'error',
      });
      return;
    }
    if (!isUploadTypeSingle && album?.tracks?.length === 10) {
      toastResponseMessage({
        content: 'You can only upload a maximum of 10 tracks for an album',
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
      <View className="flex justify-between items-center mt-12 px-6">
        <StyledText weight="bold" size="2xl">
          {isUploadTypeSingle ? 'Upload your track here' : 'Upload tracks for'}{' '}
          {!isUploadTypeSingle && (
            <StyledText
              weight="extrabold"
              size="2xl"
              className="text-purple-400"
            >
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

      {trackModalVisible && (
        <TrackDetailsModal
          // action={ActionsEnum.CREATE}
          visible={trackModalVisible}
          onClose={onModalClose}
        />
      )}

      <TouchableOpacity
        onPress={onAddTrack}
        activeOpacity={0.8}
        style={{ marginVertical: 20 }}
        className="mt-8 px-6"
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
            width: '100%',
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
              ? 'Add your track to MusicVerse! You can only upload one track at a time.'
              : 'Add multiple tracks to MusicVerse! You can only upload a maximum of 10 tracks for an album.'}
          </StyledText>
        </LinearGradient>
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'column',
          borderRadius: 6,
          marginHorizontal: 24,
          padding: 10,
          backgroundColor: COLORS.neutral.dark,
          marginTop: 6,
        }}
        showsVerticalScrollIndicator
        persistentScrollbar
        horizontal={false}
      >
        {!track && !album?.tracks?.length && (
          <View className="flex justify-between items-center w-full">
            <LottieView
              source={EmptyGhostLA}
              autoPlay
              loop
              speed={0.5}
              style={{
                width: '100%',
                height: 125,
                transform: [
                  {
                    scale: 1.7,
                  },
                  {
                    translateY: -10,
                  },
                ],
              }}
            />
            <StyledText weight="bold" size="xl" className="text-center">
              Waiting for tracks...
            </StyledText>
          </View>
        )}
        {!isUploadTypeSingle &&
          album?.tracks?.length &&
          album?.tracks?.map((track) => {
            const { progress, uploadStatus } = progressDetails?.[
              track.uploadKey
            ] || { progress: 0, uploadStatus: UploadStatus.QUEUED };
            return (
              <AudioDetailsCard
                key={track.uploadKey}
                title={track.title}
                size={formatBytes(track.src.size)}
                duration={formatDuration(track.src.duration, true)}
                extension={extractExtension(track.src.name)}
                onEdit={() => {}}
                onRemove={() => {
                  toastResponseMessage({
                    content: 'Track removed successfully.',
                    type: 'success',
                  });
                  removeTrackFromAlbum(track.title);
                }}
                uploadProgress={progress}
                uploadStatus={uploadStatus}
              />
            );
          })}
        {isUploadTypeSingle && track && (
          <AudioDetailsCard
            title={track.title}
            size={formatBytes(track.src.size)}
            duration={formatDuration(track.src.duration, true)}
            extension={extractExtension(track.src.name)}
            onEdit={() => {}}
            onRemove={() => {
              toastResponseMessage({
                content: 'Track removed successfully.',
                type: 'success',
              });
              removeTrack();
            }}
            uploadProgress={
              getValueFromRecordByIndex(progressDetails, 0)?.progress
            }
            uploadStatus={
              getValueFromRecordByIndex(progressDetails, 0)?.uploadStatus
            }
          />
        )}
      </ScrollView>

      <View className="flex flex-col px-4 mt-4 w-full">
        {isUploading && (
          <StyledButton
            variant="secondary"
            fullWidth
            onPress={() => {
              cancelUpload();
            }}
          >
            <StyledText weight="bold" size="lg">
              Cancel Upload
            </StyledText>
          </StyledButton>
        )}
        <StyledButton
          variant="primary"
          fullWidth
          loading={loading || isUploading}
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
