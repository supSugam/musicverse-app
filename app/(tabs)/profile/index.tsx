import Container from '@/components/Container';
import FadingDarkGradient from '@/components/Playlist/FadingDarkGradient';
import FollowButton from '@/components/Profile/FollowButton';
import ProfileName from '@/components/Profile/ProfileName';
import TrackListItem from '@/components/Tracks/TrackListItem';
import AnimatedTouchable from '@/components/reusables/AnimatedTouchable';
import BackNavigator from '@/components/reusables/BackNavigator';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import ListSkeleton from '@/components/reusables/Skeleton/ListSkeleton';
import {
  Skeleton,
  SkeletonLoader,
} from '@/components/reusables/Skeleton/Skeleton';
import StyledText from '@/components/reusables/StyledText';
import TextContainer from '@/components/reusables/TextContainer';
import TogglePlayButton from '@/components/reusables/TogglePlayButton';
import COLORS from '@/constants/Colors';
import { useFollowQuery } from '@/hooks/react-query/useFollowQuery';
import { useProfileQuery } from '@/hooks/react-query/useProfileQuery';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';
import { calculatePercentage } from '@/utils/helpers/number';
import { formatNumber } from '@/utils/helpers/string';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const ProfilePage: React.FC = () => {
  // For Profile Data
  const { username } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState<
    IUserWithProfile | undefined
  >();

  const isOwnProfile = useAuthStore(
    ({ currentUser }) =>
      currentUser?.username === username || currentUser?.id === username
  );

  const {
    getProfileByUsername: {
      data: userData,
      refetch: refetchProfile,
      isRefetching: isRefetchingProfile,
      isLoading: isProfileLoading,
    },
  } = useProfileQuery({
    username,
  });

  useEffect(() => {
    setUserProfile(userData?.data?.result);
  }, [userData]);

  // For Tracks Data
  const [usersPopularTracks, setUsersPopularTracks] = useState<ITrackDetails[]>(
    []
  );

  const {
    getAllTracks: {
      data: userTracks,
      refetch: refetchTracks,
      isRefetching: isTracksRefetching,
      isLoading: isTracksLoading,
    },
  } = useTracksQuery({
    getAllTracksConfig: {
      params: {
        pageSize: 5,
        page: 1,
        creator: true,
        creatorId: typeof username === 'string' ? username : undefined,
      },
      queryOptions: {
        enabled: !!username && typeof username === 'string',
      },
    },
  });

  useEffect(() => {
    setUsersPopularTracks(userTracks?.data.result?.items ?? []);
  }, [userTracks]);

  // Refetch
  const isRefetching = useMemo(() => {
    return isRefetchingProfile || isTracksRefetching;
  }, [isRefetchingProfile, isTracksRefetching]);
  const refetchEverything = async () => {
    refetchProfile();
    refetchTracks();
  };

  // Player Store

  const {
    updateTracks,
    currentTrack,
    isThisQueuePlaying,
    playATrackById,
    isBuffering,
  } = usePlayerStore();

  // Image View
  const [profileCoverWidth, setProfileCoverWidth] = useState<number>(0);

  const bgOpacity = useSharedValue(0.0);

  const backgroundViewAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const imageContainerScale = useSharedValue(1);

  const imageContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageContainerScale.value }],
  }));

  const { isThisTrackPlaying, setQueueId, playPause } = usePlayerStore();

  const { toggleFollow } = useFollowQuery();
  const onFollowPress = () => {
    if (!userProfile?.id) return;
    toggleFollow.mutateAsync(userProfile?.id);
  };

  const navigation = useNavigation();
  const onFollowersFollowingPress = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FollowerFollowingTabs',
        params: {
          userId: username,
        },
      })
    );
  };
  return (
    <Container statusBarPadding={false}>
      <Skeleton
        isLoading={isProfileLoading || isTracksLoading || isRefetching}
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
        <Animated.View
          className="w-full h-full flex-grow absolute top-0 left-0"
          style={[
            backgroundViewAnimatedStyle,
            { zIndex: 2, backgroundColor: COLORS.neutral.dense },
          ]}
        />
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { zIndex: 1 },
            imageContainerAnimatedStyle,
          ]}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setProfileCoverWidth(width);
          }}
        >
          {/* // Gradient */}

          <FadingDarkGradient
            stops={[
              [0, 0.9],
              [0.3, 0.3],
              [0.8, 0.9],
              [1, 1],
            ]}
          />
          <ImageDisplay
            placeholder="Cover Image"
            width={'100%'}
            height={profileCoverWidth * 0.8}
            source={userProfile?.profile?.cover}
          />

          {/* <View className="absolute bottom-2 right-4 z-[2]">
          <ImageDisplay
            placeholder={<StyledText>Avatar</StyledText>}
            width={profileCoverWidth * 0.18}
            height={profileCoverWidth * 0.18}
            source={userProfile?.profile?.avatar}
            borderRadius={'full'}
            bordered
            shadows
          />
        </View> */}
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            top: 0,
            zIndex: 15,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 32,
            paddingBottom: 8,
            paddingHorizontal: 2,
          }}
        >
          <Animated.View
            style={[
              backgroundViewAnimatedStyle,
              {
                backgroundColor: COLORS.neutral.dense,
                zIndex: -1,
                ...StyleSheet.absoluteFillObject,
                borderBottomColor: COLORS.neutral.semidark,
                borderBottomWidth: 1,
              },
            ]}
          />
          <BackNavigator showBackText />
          <AnimatedTouchable
            wrapperClassName="flex flex-row items-center px-4 py-1"
            onPress={() => {}}
          >
            <MaterialIcons
              name="more-vert"
              size={30}
              color={COLORS.neutral.light}
            />
          </AnimatedTouchable>
        </Animated.View>
        <View className="w-full z-10 flex-1 h-full">
          <ScrollView
            onScroll={(event) => {
              // clo(event.nativeEvent.contentOffset.y);
              const contentOffsetY = event.nativeEvent.contentOffset.y;

              // Image Container Scale
              const percentage = calculatePercentage(
                contentOffsetY,
                profileCoverWidth * 0.7
              );

              const newValue = percentage / 100;
              bgOpacity.value = withSpring(newValue, {
                damping: 10,
                stiffness: 100,
              });

              imageContainerScale.value = withSpring(1 + newValue, {
                damping: 20,
                stiffness: 100,
              });
            }}
            style={styles.scrollView}
            bouncesZoom
            bounces
            alwaysBounceVertical
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  refetchEverything();
                }}
              />
            }
          >
            {/* </GestureDetector> */}
            {/* User's Public Contents */}

            <View className="h-64 w-full" />

            <View className="flex p-4 flex-row justify-between items-center">
              <View className="flex flex-col">
                <StyledText
                  size="4xl"
                  weight="bold"
                  tracking="tight"
                  color={COLORS.neutral.light}
                >
                  {userProfile?.profile?.name}
                </StyledText>
                <StyledText
                  size="base"
                  weight="medium"
                  tracking="tight"
                  color={COLORS.neutral.normal}
                  className="mt-1"
                  onPress={onFollowersFollowingPress}
                >
                  {`${formatNumber(
                    userProfile?._count?.followers
                  )} Followers • ${formatNumber(
                    userProfile?._count?.following
                  )} Following`}
                </StyledText>
              </View>
              <TogglePlayButton
                size={40}
                onPress={() => {
                  if (isThisQueuePlaying(usersPopularTracks?.[0]?.id)) {
                    playPause();
                    return;
                  }
                  if (!usersPopularTracks?.length) return;
                  updateTracks(usersPopularTracks || []);
                  setQueueId(usersPopularTracks?.[0].id);
                  playATrackById(usersPopularTracks?.[0].id);
                }}
                isPlaying={isThisQueuePlaying(usersPopularTracks?.[0]?.id)}
              />
            </View>

            <View
              className="flex flex-1 relative"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              {!isOwnProfile && (
                <ProfileName
                  fullWidth
                  name={userProfile?.username}
                  image={userProfile?.profile?.avatar}
                  id={userProfile?.id}
                  userRole={userProfile?.role}
                  width={36}
                  height={36}
                  rightComponent={
                    <FollowButton
                      isFollowing={userProfile?.isFollowing}
                      onPress={onFollowPress}
                      id={userProfile?.id}
                    />
                  }
                  className="my-3"
                />
              )}

              {/* Tracks */}
              <View className="flex flex-col my-3">
                <StyledText
                  size="lg"
                  weight="semibold"
                  tracking="tighter"
                  color={COLORS.neutral.light}
                >
                  Popular Tracks
                </StyledText>
                <View className="flex flex-col mt-4">
                  {usersPopularTracks.map((track, i) => (
                    <TrackListItem
                      index={i}
                      key={track.id + i}
                      id={track.id}
                      title={track.title}
                      onPlayClick={() => {
                        playATrackById(track.id);
                      }}
                      isPlaying={isThisTrackPlaying(track.id, true)}
                      artistName={
                        track?.creator?.profile?.name ||
                        track?.creator?.username
                      }
                      artistId={track?.creator?.id}
                      cover={track.cover}
                      duration={track.trackDuration}
                      isLiked={track?.isLiked}
                      isBuffering={
                        isBuffering && currentTrack()?.id === track.id
                      }
                      label={i + 1}
                    />
                  ))}
                </View>

                <TextContainer
                  text={userProfile?.profile?.bio || 'No Bio'}
                  heading="Bio"
                  className="text-left"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Skeleton>
    </Container>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    position: 'relative',
    maxHeight: '100%',
    zIndex: 5,
  },
});
