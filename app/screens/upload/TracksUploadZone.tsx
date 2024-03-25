import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import StyledText from '@/components/reusables/StyledText';
import { StyledButton } from '@/components/reusables/StyledButton';
import { useUploadStore } from '@/services/zustand/stores/useUploadStore';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { UserRole } from '@/utils/Interfaces/IUser';
import COLORS from '@/constants/Colors';
import TrackDetailsModal from './components/TrackDetailsModal';
import AudioDetailsCard from './components/AudioDetailsCard';
import {
  extractExtension,
  formatBytes,
  formatDuration,
} from '@/utils/helpers/string';
import { EmptyGhostLA } from '@/assets/lottie';
import LottieView from 'lottie-react-native';
import useUploadAssets from '@/hooks/react-query/useUploadAssets';
import { ICreateAlbumPayload } from '@/utils/Interfaces/IAlbum';

import {
  getObjectAsFormData,
  getValueFromRecordByIndex,
} from '@/utils/helpers/ts-utilities';
import { UploadStatus } from '@/utils/enums/IUploadStatus';
import Animated from 'react-native-reanimated';
import AddTrackButton from './components/AddTrackButton';
import { cleanObject } from '@/utils/helpers/Object';
import { ITrack } from '@/utils/Interfaces/ITrack';
import { ActionsEnum } from '@/utils/enums/Action';
import { useAlbumsQuery } from '@/hooks/react-query/useAlbumsQuery';

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
  const [createTrackModalVisible, setCreateTrackModalVisible] =
    useState<boolean>(false);
  const [editTrackModalVisible, setEditTrackModalVisible] =
    useState<boolean>(false);
  const [trackToEdit, setTrackToEdit] = useState<ITrack | null>(null);

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
    onUploadSuccess(data) {
      console.log('Tracks uploaded successfully', data);
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
  const { createAlbum } = useAlbumsQuery({});

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
        setLoading(true);
        const { tracks, ...rest } = cleanObject(album);

        const formData = getObjectAsFormData<ICreateAlbumPayload>(
          rest as ICreateAlbumPayload
        );
        await createAlbum.mutateAsync(formData, {
          onSuccess: async (data) => {
            toastResponseMessage({
              content: 'Album Created, Uploading tracks now...',
              type: 'success',
            });
            const albumId = data.data.result.id;

            if (!albumId || !tracks?.length) {
              toastResponseMessage({
                content: 'Album ID not found',
                type: 'error',
              });
              setLoading(false);
              return;
            }
            const albumTracksWithAlbumId = tracks.map((track) => ({
              ...track,
              albumIds: [albumId] as string[],
            }));

            uploadTracks(albumTracksWithAlbumId);
          },

          onError: (e) => {
            console.log('Error creating album', e);
            setLoading(false);
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
    setCreateTrackModalVisible(true);
  };

  const onCreateModalClose = () => {
    setCreateTrackModalVisible(false);
  };

  const onEditModalClose = () => {
    setEditTrackModalVisible(false);
    setTrackToEdit(null);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const onEditTrackClick = (track: ITrack) => {
    setEditTrackModalVisible(true);
    setTrackToEdit(track);
  };

  return (
    <Container includeNavBar navbarTitle="Upload">
      <View className="flex justify-between items-center mt-12 px-6">
        <StyledText weight="bold" size="2xl">
          {isUploadTypeSingle ? 'Upload your track here' : 'Upload tracks for'}
          {!isUploadTypeSingle && (
            <StyledText
              weight="extrabold"
              size="2xl"
              className="text-purple-400"
            >
              {' '}
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

      {createTrackModalVisible && (
        <TrackDetailsModal
          visible={createTrackModalVisible}
          onClose={onCreateModalClose}
          action={ActionsEnum.CREATE}
        />
      )}
      {editTrackModalVisible && (
        <TrackDetailsModal
          visible={editTrackModalVisible}
          onClose={onEditModalClose}
          action={ActionsEnum.UPDATE}
        />
      )}

      <AddTrackButton
        onAddTrack={onAddTrack}
        isUploadTypeSingle={isUploadTypeSingle}
        collapse={
          (isUploading || loading) && (track || album?.tracks?.length)
            ? true
            : false
        }
      />

      <ScrollView
        contentContainerStyle={{
          flexDirection: 'column',
          borderRadius: 6,
          marginHorizontal: 24,
          padding: 10,
          backgroundColor: COLORS.neutral.dark,
          marginTop: 6,
          height: '100%',
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
                height: 140,
                transform: [
                  {
                    scale: 1.5,
                  },
                  {
                    translateY: -5,
                  },
                ],
              }}
            />
            <StyledText weight="bold" size="xl" className="text-center mt-2">
              Waiting for tracks...
            </StyledText>
          </View>
        )}

        {!isUploadTypeSingle &&
          album?.tracks &&
          album.tracks.length > 0 &&
          album.tracks.map((track) => {
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
                onRemove={() => {
                  toastResponseMessage({
                    content: 'Track removed successfully.',
                    type: 'success',
                  });
                  removeTrackFromAlbum(track.title);
                }}
                uploadProgress={progress}
                uploadStatus={uploadStatus}
                alwaysShowProgressBar
              />
            );
          })}
        {isUploadTypeSingle && track && (
          <AudioDetailsCard
            key={track.uploadKey}
            title={track.title}
            size={formatBytes(track.src.size)}
            duration={formatDuration(track.src.duration, true)}
            extension={extractExtension(track.src.name)}
            alwaysShowProgressBar
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
