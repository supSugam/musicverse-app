import Container from '@/components/Container';
import FollowButton from '@/components/Profile/FollowButton';
import ProfileName from '@/components/Profile/ProfileName';
import TrackListItem from '@/components/Tracks/TrackListItem';
import AnimatedTouchable from '@/components/reusables/AnimatedTouchable';
import BackNavigator from '@/components/reusables/BackNavigator';
import Capsule from '@/components/reusables/Capsule';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import TogglePlayButton from '@/components/reusables/TogglePlayButton';
import StyledText from '@/components/reusables/StyledText';
import TextContainer from '@/components/reusables/TextContainer';
import COLORS from '@/constants/Colors';
import { useAlbumsQuery } from '@/hooks/react-query/useAlbumsQuery';
import { useFollowQuery } from '@/hooks/react-query/useFollowQuery';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import { getYear } from '@/utils/helpers/date';
import { calculatePercentage } from '@/utils/helpers/number';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import MenuModal from '@/components/reusables/BottomSheetMenu/MenuModal';

import { CommonActions } from '@react-navigation/native';
import useImageColors from '@/hooks/useColorExtractor';

import FadingDarkGradient from '@/components/Playlist/FadingDarkGradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import ReusableAlert from '@/components/reusables/ReusableAlert';
import ListSkeleton from '@/components/reusables/Skeleton/ListSkeleton';
import {
  Skeleton,
  SkeletonLoader,
} from '@/components/reusables/Skeleton/Skeleton';

const AlbumPage: React.FC = () => {
  // COlor Extracter

  // For Album Data
  const { currentUser } = useAuthStore();
  const { id } = useLocalSearchParams();
  const [albumDetails, setAlbumDetails] = useState<IAlbumDetails | undefined>();
  const {
    getAlbumById: {
      data: albumData,
      refetch: refetchAlbumDetails,
      isRefetching: isRefetchingAlbumDetails,
      isLoading: isAlbumLoading,
    },
    toggleSaveAlbum,
    deleteAlbumById,
  } = useAlbumsQuery({
    id: id as string,
  });

  useEffect(() => {
    albumData?.data?.result?.tracks?.forEach((track) => {
      track.creator = albumData?.data?.result?.creator;
    });
    setAlbumDetails(albumData?.data?.result);
  }, [albumData]);

  // For Tracks Data

  // Refetch
  const refetchEverything = async () => {
    await refetchAlbumDetails();
  };
  const { averageColor } = useImageColors(albumDetails?.cover);

  useEffect(() => {
    console.log(averageColor);
  }, [averageColor]);
  // Player Store

  const {
    updateTracks,
    currentTrack,
    isPlaying,
    playATrackById,
    isBuffering,
    setQueueId,
    isThisQueuePlaying,
    playPause,
  } = usePlayerStore();

  // Image View
  const [albumCoverWidth, setAlbumCoverWidth] = useState<number>(0);

  const bgOpacity = useSharedValue(1);

  const backgroundViewAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const imageContainerScale = useSharedValue(1);
  const imageContainerPositionY = useSharedValue(0);
  const imageOpacity = useSharedValue(1);

  const imageContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: imageContainerScale.value },
      {
        translateY: imageContainerPositionY.value,
      },
    ],
    opacity: imageOpacity.value,
  }));

  // Follow/Unfollow

  const { toggleFollow } = useFollowQuery();

  const onFollowPress = async () => {
    if (!albumDetails?.creator?.id) return;
    await toggleFollow.mutateAsync(albumDetails?.creator?.id, {
      onSuccess: () => {
        refetchEverything();
      },
    });
  };

  // Album Options
  const navigation = useNavigation();

  const onToggleAlbumSave = async () => {
    if (!albumDetails?.id) return;
    toggleSaveAlbum.mutate(albumDetails?.id, {
      onSuccess: (data) => {
        setAlbumDetails((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isSaved: !prev.isSaved,
            _count: {
              ...prev._count,
              savedBy: data.data.result.count,
            },
          };
        });
      },
    });
  };

  const { share, createUrl } = useAppState();

  const onShareAlbum = () => {
    if (!albumDetails?.id) return;
    const url = createUrl(`/album/${albumDetails?.id}`);
    share({
      title: albumDetails?.title,
      url,
    });
  };

  const [ownerOptionsModalVisible, setOwnerOptionsModalVisible] =
    useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  return (
    <Container>
      <Skeleton
        isLoading={isAlbumLoading || isRefetchingAlbumDetails}
        skeletonComponent={
          <View className="flex flex-col w-full mt-12 px-3">
            <SkeletonLoader type="rect" height={250} width="100%" />
            <SkeletonLoader
              type="rect"
              height={20}
              width="65%"
              marginTop={25}
            />
            <SkeletonLoader
              type="rect"
              height={15}
              width="55%"
              marginTop={12}
              marginBottom={16}
            />

            <ListSkeleton numbers={6} />
          </View>
        }
      >
        <ReusableAlert
          visible={deleteModalVisible}
          header="Delete Album"
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={async () => {
            if (!albumDetails?.id) return;
            await deleteAlbumById.mutateAsync(albumDetails?.id, {
              onSuccess: () => {
                setDeleteModalVisible(false);
                navigation.dispatch(CommonActions.goBack());
              },
            });
          }}
        >
          <StyledText size="lg" weight="semibold">
            Are you sure you want to delete this album?
          </StyledText>
        </ReusableAlert>
        <MenuModal
          visible={ownerOptionsModalVisible}
          onClose={() => setOwnerOptionsModalVisible(false)}
          items={[
            {
              label: 'Edit Album',
              onPress: () => {
                setOwnerOptionsModalVisible(false);
                navigation.dispatch(
                  CommonActions.navigate('UpdateAlbum', {
                    id: albumDetails?.id,
                  })
                );
              },
              icon: 'auto-awesome',
            },
            {
              label: 'Delete Album',
              onPress: () => {
                setOwnerOptionsModalVisible(false);
                setDeleteModalVisible(true);
              },
              icon: 'delete',
            },
          ]}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
        >
          <Animated.View
            style={[
              backgroundViewAnimatedStyle,
              {
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
                backgroundColor: averageColor || COLORS.neutral.dark,
              },
            ]}
          />
          <FadingDarkGradient
            stops={[
              [0, 0.8],
              [0.1, 0.4],
              [0.5, 1],
            ]}
          />
        </View>
        <ScrollView
          onScroll={(event) => {
            // clo(event.nativeEvent.contentOffset.y);
            const contentOffsetY = event.nativeEvent.contentOffset.y;

            // Image Container Scale
            const percentage = calculatePercentage(
              contentOffsetY,
              albumCoverWidth
            );
            const newScale = Math.min(Math.max(1 - percentage / 100, 0.6), 1);
            imageContainerScale.value = newScale;
            imageContainerPositionY.value = contentOffsetY / 2;
            bgOpacity.value = 1 - percentage / 100;
            if (newScale <= 0.6) {
              imageOpacity.value = 1 - percentage / 100;
            } else {
              imageOpacity.value = 1;
            }
          }}
          style={styles.scrollView}
          bouncesZoom
          bounces
          alwaysBounceVertical
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingAlbumDetails}
              onRefresh={() => {
                refetchEverything();
              }}
            />
          }
          stickyHeaderIndices={[0, 2]}
        >
          <BackNavigator
            showBackText
            title="Album"
            style={{
              paddingTop: 0,
              paddingBottom: 10,
            }}
            backgroundColor={COLORS.neutral.dense}
            backgroundOpacity={bgOpacity.value - 0.85}
          />

          <View className="w-full relative flex items-center justify-start">
            <Animated.View
              style={[
                {
                  zIndex: 1,
                  height: albumCoverWidth,
                  width: '60%',
                  borderRadius: 10,
                },
                imageContainerAnimatedStyle,
              ]}
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setAlbumCoverWidth(width);
              }}
            >
              <FadingDarkGradient
                stops={[
                  [0, 0.1],
                  [0.7, 0.2],
                  [1, 0.6],
                ]}
              />

              <ImageDisplay
                placeholder="Cover Image"
                width="100%"
                height="100%"
                source={albumDetails?.cover}
              />
            </Animated.View>
          </View>

          {/* Image */}

          <View className="flex flex-col px-4 py-1 mt-10">
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row items-center mb-3">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onToggleAlbumSave}
                >
                  <MaterialIcons
                    name={albumDetails?.isSaved ? 'playlist-remove' : 'queue'}
                    size={24}
                    color={COLORS.neutral.normal}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onShareAlbum}
                  style={{ marginLeft: 10 }}
                >
                  <MaterialIcons
                    name="share"
                    size={24}
                    color={COLORS.neutral.normal}
                  />
                </TouchableOpacity>
              </View>
              {currentUser?.id !== albumDetails?.creator?.id && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setOwnerOptionsModalVisible(true)}
                >
                  <MaterialIcons
                    name="more-vert"
                    size={28}
                    color={COLORS.neutral.normal}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-col">
                <StyledText
                  size="3xl"
                  weight="bold"
                  tracking="tight"
                  color={COLORS.neutral.light}
                >
                  {albumDetails?.title}
                </StyledText>
                <StyledText
                  size="sm"
                  weight="semibold"
                  tracking="tighter"
                  color={COLORS.neutral.normal}
                  className="mt-1"
                >
                  {`Album  • ${getYear(albumDetails?.createdAt)} • ${
                    albumDetails?._count?.savedBy || 0
                  } Saves`}
                </StyledText>
              </View>
              <TogglePlayButton
                size={28}
                onPress={() => {
                  if (isThisQueuePlaying(albumDetails?.id)) {
                    playPause();
                    return;
                  }
                  if (!albumDetails?.tracks) return;
                  updateTracks(albumDetails?.tracks || []);
                  setQueueId(albumDetails?.id);
                  playATrackById(albumDetails?.tracks[0].id);
                }}
                isPlaying={isThisQueuePlaying(albumDetails?.id)}
              />
            </View>
          </View>

          {/* Options */}

          <View
            className="flex flex-1 relative mt-5"
            style={{
              paddingHorizontal: 12,
            }}
          >
            {/* Tracks */}
            <View className="flex flex-col">
              {/* Misc */}

              <View className="flex w-full flex-row justify-between items-center">
                <ProfileName
                  name={
                    albumDetails?.creator?.profile?.name ||
                    albumDetails?.creator?.username
                  }
                  image={albumDetails?.creator?.profile?.avatar}
                  id={albumDetails?.creator?.id}
                  userRole={albumDetails?.creator?.role}
                  width={36}
                  height={36}
                  fullWidth
                  rightComponent={
                    <FollowButton
                      isFollowing={albumDetails?.creator?.isFollowing || false}
                      onPress={onFollowPress}
                      id={albumDetails?.creator?.id}
                    />
                  }
                />
              </View>
              <View className="flex flex-row justify-between items-center w-full mb-5 mt-5">
                <StyledText
                  size="lg"
                  weight="bold"
                  tracking="tight"
                  color={COLORS.neutral.light}
                >
                  Tracks ({albumDetails?._count?.tracks || 0})
                </StyledText>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row"
                  contentContainerStyle={{
                    maxWidth: '50%',
                    marginLeft: 'auto',
                  }}
                >
                  {[
                    albumDetails?.genre,
                    ...(albumDetails?.tags ? albumDetails?.tags : []),
                  ].map((tag, index) => (
                    <Capsule
                      key={(tag?.id as string) + index}
                      text={tag?.name as string}
                      selected={index === 0}
                    />
                  ))}
                </ScrollView>
              </View>

              <ScrollView bounces alwaysBounceVertical>
                {albumDetails?.tracks?.map((track, index) => (
                  <TrackListItem
                    key={track.id + index}
                    id={track.id}
                    title={track.title}
                    onPlayClick={() => {
                      playATrackById(track.id);
                    }}
                    isPlaying={currentTrack()?.id === track.id && isPlaying}
                    artistName={
                      track?.creator?.profile?.name || track?.creator?.username
                    }
                    artistId={track?.creator?.id}
                    cover={track.cover}
                    duration={track.trackDuration}
                    isLiked={track?.isLiked}
                    isBuffering={isBuffering && currentTrack()?.id === track.id}
                    label={index + 1}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
          <TextContainer
            text={albumDetails?.description}
            heading="About this Album"
            padding={[18, 8]}
          />
        </ScrollView>
      </Skeleton>
    </Container>
  );
};

export default AlbumPage;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    position: 'relative',
    maxHeight: '100%',
    zIndex: 5,
  },
});
