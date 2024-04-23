import Container from '@/components/Container';
import FollowButton from '@/components/Profile/FollowButton';
import ProfileName from '@/components/Profile/ProfileName';
import TrackListItem from '@/components/Tracks/TrackListItem';
import BackNavigator from '@/components/reusables/BackNavigator';
import Capsule from '@/components/reusables/Capsule';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import TogglePlayButton from '@/components/reusables/TogglePlayButton';
import StyledText from '@/components/reusables/StyledText';
import TextContainer from '@/components/reusables/TextContainer';
import COLORS from '@/constants/Colors';
import { usePlaylistsQuery } from '@/hooks/react-query/usePlaylistsQuery';
import { useFollowQuery } from '@/hooks/react-query/useFollowQuery';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { IPlaylistDetails } from '@/utils/Interfaces/IPlaylist';
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
const PlaylistPage: React.FC = () => {
  // COlor Extracter

  // For Playlist Data
  const { currentUser } = useAuthStore();
  const { playlistId } = useLocalSearchParams();
  const [playlistDetails, setPlaylistDetails] = useState<
    IPlaylistDetails | undefined
  >();
  const {
    getPlaylistById: {
      data: playlistData,
      refetch: refetchPlaylistDetails,
      isRefetching: isRefetchingPlaylistDetails,
      isLoading: isPlaylistLoading,
    },
    toggleSavePlaylist,
    deletePlaylistById,
  } = usePlaylistsQuery({
    id: playlistId as string,
  });

  useEffect(() => {
    playlistData?.data?.result?.tracks?.forEach((track) => {
      track.creator = playlistData?.data?.result?.creator;
    });
    setPlaylistDetails(playlistData?.data?.result);
  }, [playlistData]);

  // For Tracks Data

  // Refetch
  const refetchEverything = async () => {
    await refetchPlaylistDetails();
  };
  const { averageColor } = useImageColors(playlistDetails?.cover);

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
  const [playlistCoverWidth, setPlaylistCoverWidth] = useState<number>(0);

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
    if (!playlistDetails?.creator?.id) return;
    await toggleFollow.mutateAsync(playlistDetails?.creator?.id, {
      onSuccess: () => {
        refetchEverything();
      },
    });
  };

  // Playlist Options
  const navigation = useNavigation();

  const onTogglePlaylistSave = async () => {
    if (!playlistDetails?.id) return;
    toggleSavePlaylist.mutate(playlistDetails?.id, {
      onSuccess: (data) => {
        setPlaylistDetails((prev) => {
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

  const onSharePlaylist = () => {
    if (!playlistDetails?.id) return;
    const url = createUrl(`/playlist/${playlistDetails?.id}`);
    share({
      title: playlistDetails?.title,
      url,
    });
  };

  const [ownerOptionsModalVisible, setOwnerOptionsModalVisible] =
    useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  return (
    <Container>
      <Skeleton
        isLoading={isPlaylistLoading || isRefetchingPlaylistDetails}
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
          header="Delete Playlist"
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={async () => {
            if (!playlistDetails?.id) return;
            await deletePlaylistById.mutateAsync(playlistDetails?.id, {
              onSuccess: () => {
                setDeleteModalVisible(false);
                navigation.dispatch(CommonActions.goBack());
              },
            });
          }}
        >
          <StyledText size="lg" weight="semibold">
            Are you sure you want to delete this playlist?
          </StyledText>
        </ReusableAlert>
        <MenuModal
          visible={ownerOptionsModalVisible}
          onClose={() => setOwnerOptionsModalVisible(false)}
          items={[
            {
              label: 'Edit Playlist',
              onPress: () => {
                setOwnerOptionsModalVisible(false);
                navigation.dispatch(
                  CommonActions.navigate('UpdatePlaylist', {
                    id: playlistDetails?.id,
                  })
                );
              },
              icon: 'auto-awesome',
            },
            {
              label: 'Delete Playlist',
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
                backgroundColor: averageColor || COLORS.neutral.semidark,
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
              playlistCoverWidth
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
              refreshing={isRefetchingPlaylistDetails}
              onRefresh={() => {
                refetchEverything();
              }}
            />
          }
          stickyHeaderIndices={[0, 2]}
        >
          <BackNavigator
            showBackText
            title="Playlist"
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
                  height: playlistCoverWidth,
                  width: '60%',
                  borderRadius: 10,
                },
                imageContainerAnimatedStyle,
              ]}
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setPlaylistCoverWidth(width);
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
                source={playlistDetails?.cover}
              />
            </Animated.View>
          </View>

          {/* Image */}

          <View className="flex flex-col px-4 py-1 mt-10">
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row items-center mb-3">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onTogglePlaylistSave}
                >
                  <MaterialIcons
                    name={
                      playlistDetails?.isSaved ? 'playlist-remove' : 'queue'
                    }
                    size={24}
                    color={COLORS.neutral.normal}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onSharePlaylist}
                  style={{ marginLeft: 10 }}
                >
                  <MaterialIcons
                    name="share"
                    size={24}
                    color={COLORS.neutral.normal}
                  />
                </TouchableOpacity>
              </View>
              {currentUser?.id !== playlistDetails?.creator?.id && (
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
                  {playlistDetails?.title}
                </StyledText>
                <StyledText
                  size="sm"
                  weight="semibold"
                  tracking="tighter"
                  color={COLORS.neutral.normal}
                  className="mt-1"
                >
                  {`Playlist  • ${getYear(playlistDetails?.createdAt)} • ${
                    playlistDetails?._count?.savedBy || 0
                  } Saves`}
                </StyledText>
              </View>
              <TogglePlayButton
                size={28}
                onPress={() => {
                  if (isThisQueuePlaying(playlistDetails?.id)) {
                    playPause();
                    return;
                  }
                  if (!playlistDetails?.tracks) return;
                  updateTracks(playlistDetails?.tracks || []);
                  setQueueId(playlistDetails?.id);
                  playATrackById(playlistDetails?.tracks[0].id);
                }}
                isPlaying={isThisQueuePlaying(playlistDetails?.id)}
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
                    playlistDetails?.creator?.profile?.name ||
                    playlistDetails?.creator?.username
                  }
                  image={playlistDetails?.creator?.profile?.avatar}
                  id={playlistDetails?.creator?.id}
                  userRole={playlistDetails?.creator?.role}
                  width={36}
                  height={36}
                  fullWidth
                  rightComponent={
                    <FollowButton
                      isFollowing={
                        playlistDetails?.creator?.isFollowing || false
                      }
                      onPress={onFollowPress}
                      id={playlistDetails?.creator?.id}
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
                  Tracks ({playlistDetails?._count?.tracks || 0})
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
                    ...(playlistDetails?.tags ? playlistDetails?.tags : []),
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
                {playlistDetails?.tracks?.map((track, index) => (
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
            text={playlistDetails?.description}
            heading="About this Playlist"
            padding={[18, 8]}
          />
        </ScrollView>
      </Skeleton>
    </Container>
  );
};

export default PlaylistPage;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    position: 'relative',
    maxHeight: '100%',
    zIndex: 5,
  },
});
