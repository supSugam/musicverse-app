// app/tabs/home/HomeScreen.tsx
import Container from '@/components/Container';
import DarkGradient from '@/components/Playlist/DarkGradient';
import TrackListItem from '@/components/Tracks/TrackListItem';
import GenreScrollView from '@/components/home/GenreScrollView';
import AnimatedTouchable from '@/components/reusables/AnimatedTouchable';
import BackButton from '@/components/reusables/BackButton';
import BackNavigator from '@/components/reusables/BackNavigator';
import PrimaryGradient from '@/components/reusables/Gradients/PrimaryGradient';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import StyledText from '@/components/reusables/StyledText';
import COLORS from '@/constants/Colors';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import { useProfileQuery } from '@/hooks/react-query/useProfileQuery';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { IUserWithProfile, UserRole } from '@/utils/Interfaces/IUser';
import { getRoleLabel } from '@/utils/constants';
import { clo } from '@/utils/helpers/Object';
import { calculatePercentage } from '@/utils/helpers/number';
import { formatNumber } from '@/utils/helpers/string';
import { MaterialIcons } from '@expo/vector-icons';
import { MediaTypeOptions } from 'expo-image-picker';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutRectangle,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

const ProfilePage: React.FC = () => {
  // For Profile Data
  const { username } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState<IUserWithProfile | null>(null);

  const isOwnProfile = useAuthStore(
    (state) => state.currentUser?.username === username
  );

  const {
    getProfileByUsername: {
      data: userData,
      refetch: refetchProfile,
      isRefetching: isRefetchingProfile,
    },
  } = useProfileQuery({
    username: username as string,
  });

  useEffect(() => {
    if (userData) {
      setUserProfile(userData.data.result);
    }
  }, [userProfile]);

  // For Tracks Data
  const [usersPopularTracks, setUsersPopularTracks] = useState<ITrackDetails[]>(
    []
  );

  const {
    getAllTracks: {
      data: userTracks,
      refetch: refetchTracks,
      isRefetching: isTracksRefetching,
    },
  } = useTracksQuery({
    getAllTracksConfig: {
      params: {
        pageSize: 5,
        page: 1,
        creator: true,
        creatorId: userProfile?.id,
      },
    },
  });

  useEffect(() => {
    if (userTracks) {
      setUsersPopularTracks(userTracks.data.result.items);
    }
  }, [userTracks]);

  // Refetch
  const isRefetching = useMemo(() => {
    return isRefetchingProfile || isTracksRefetching;
  }, [isRefetchingProfile, isTracksRefetching]);
  const refetchEverything = async () => {
    await refetchProfile();
    await refetchTracks();
  };

  // Player Store

  const { updateTracks, currentTrack, isPlaying, playATrackById, isBuffering } =
    usePlayerStore();

  // Image View
  const [profileCoverWidth, setProfileCoverWidth] = useState<number>(0);

  // const imageContainerPanGesture = Gesture.Pan()
  //   .onChange((event) => {
  //     imageContainerScale.value = withSpring(
  //       imageContainerScale.value + (event.translationY * 1) / 2000,
  //       {
  //         damping: 10,
  //         stiffness: 100,
  //       }
  //     );
  //   })
  //   .onFinalize(() => {
  //     imageContainerScale.value = withSpring(1);
  //   });
  const bgOpacity = useSharedValue(0.0);

  const backgroundViewAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const imageContainerScale = useSharedValue(1);

  const imageContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageContainerScale.value }],
  }));

  const [backNavigatorLayout, setBackNavigatorLayout] =
    useState<LayoutRectangle>();

  return (
    <Container statusBarPadding={false}>
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

        <View
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              opacity: 1,
            },
          ]}
        >
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="rgb(0,0,0)" stopOpacity="0.9" />

                <Stop offset="0.3" stopColor="rgb(0,0,0)" stopOpacity="0.3" />
                <Stop offset="0.8" stopColor="rgb(0,0,0)" stopOpacity="0.9" />

                <Stop offset="1" stopColor="rgb(0,0,0)" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={profileCoverWidth}
              height={profileCoverWidth}
              fill="url(#grad)"
            />
          </Svg>

          {/*  */}
        </View>

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
        style={[
          backgroundViewAnimatedStyle,
          {
            backgroundColor: COLORS.neutral.dense,
            position: 'absolute',
            width: '100%',
            top: backNavigatorLayout?.y,
            zIndex: 15,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 30,
            paddingBottom: 10,
            borderBottomColor: COLORS.neutral.gray,
            borderBottomWidth: 1,
          },
        ]}
      >
        <BackButton showBackText />
        <AnimatedTouchable
          wrapperClassName="flex flex-row items-center"
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
          // stickyHeaderIndices={[0]}
        >
          {/* Back Navigator and Options */}
          {/* <View
            onLayout={(event) => {
              setBackNavigatorLayout(event.nativeEvent.layout);
            }}
            className="w-full h-12"
          /> */}

          {/* <GestureDetector gesture={imageContainerPanGesture}> */}
          {/* Image, Name and others */}

          {/* </GestureDetector> */}
          {/* User's Public Contents */}

          <View className="flex p-4 mt-64">
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
              >
                {`${formatNumber(
                  userProfile?._count?.followers
                )} Followers • ${formatNumber(
                  userProfile?._count?.following
                )} Following`}
              </StyledText>
            </View>
          </View>

          <View
            className="flex flex-1 relative"
            style={{
              paddingHorizontal: 12,
              paddingVertical: 4,
            }}
          >
            {/* Bio */}
            {/* <View
            className="flex flex-col my-3"
            style={{
              paddingHorizontal: 8,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <StyledText
              size="lg"
              weight="semibold"
              tracking="tighter"
              color={COLORS.neutral.light}
            >
              Bio
            </StyledText>
            <StyledText size="base" weight="normal" tracking="tighter">
              {userProfile?.profile?.bio}
            </StyledText>
          </View> */}

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
                    key={track.id}
                    id={track.id}
                    title={track.title}
                    onPlayClick={async () => {
                      await playATrackById(track.id);
                    }}
                    isPlaying={currentTrack()?.id === track.id && isPlaying}
                    artistName={
                      track?.creator?.profile.name || track?.creator?.username
                    }
                    artistId={track?.creator?.id}
                    cover={track.cover}
                    duration={track.trackDuration}
                    isLiked={track?.isLiked}
                    isBuffering={isBuffering && currentTrack()?.id === track.id}
                    label={i + 1}
                  />
                ))}
              </View>
            </View>
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
                    key={track.id + 'no1'}
                    id={track.id}
                    title={track.title}
                    onPlayClick={async () => {
                      await playATrackById(track.id);
                    }}
                    isPlaying={currentTrack()?.id === track.id && isPlaying}
                    artistName={
                      track?.creator?.profile.name || track?.creator?.username
                    }
                    artistId={track?.creator?.id}
                    cover={track.cover}
                    duration={track.trackDuration}
                    isLiked={track?.isLiked}
                    isBuffering={isBuffering && currentTrack()?.id === track.id}
                    label={i + 1}
                  />
                ))}
              </View>
            </View>
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
                    key={track.id + 'no2'}
                    id={track.id}
                    title={track.title}
                    onPlayClick={async () => {
                      await playATrackById(track.id);
                    }}
                    isPlaying={currentTrack()?.id === track.id && isPlaying}
                    artistName={
                      track?.creator?.profile.name || track?.creator?.username
                    }
                    artistId={track?.creator?.id}
                    cover={track.cover}
                    duration={track.trackDuration}
                    isLiked={track?.isLiked}
                    isBuffering={isBuffering && currentTrack()?.id === track.id}
                    label={i + 1}
                  />
                ))}
              </View>
            </View>
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
                    key={track.id + 'no3'}
                    id={track.id}
                    title={track.title}
                    onPlayClick={async () => {
                      await playATrackById(track.id);
                    }}
                    isPlaying={currentTrack()?.id === track.id && isPlaying}
                    artistName={
                      track?.creator?.profile.name || track?.creator?.username
                    }
                    artistId={track?.creator?.id}
                    cover={track.cover}
                    duration={track.trackDuration}
                    isLiked={track?.isLiked}
                    isBuffering={isBuffering && currentTrack()?.id === track.id}
                    label={i + 1}
                  />
                ))}
              </View>
            </View>
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
                    key={track.id + 'no4'}
                    id={track.id}
                    title={track.title}
                    onPlayClick={async () => {
                      await playATrackById(track.id);
                    }}
                    isPlaying={currentTrack()?.id === track.id && isPlaying}
                    artistName={
                      track?.creator?.profile.name || track?.creator?.username
                    }
                    artistId={track?.creator?.id}
                    cover={track.cover}
                    duration={track.trackDuration}
                    isLiked={track?.isLiked}
                    isBuffering={isBuffering && currentTrack()?.id === track.id}
                    label={i + 1}
                  />
                ))}
              </View>
            </View>
          </View>
          {/*  */}
        </ScrollView>
      </View>
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
