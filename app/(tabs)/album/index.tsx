import Container from '@/components/Container';
import FadingDarkGradient from '@/components/Playlist/FadingDarkGradient';
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
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import MenuModal from '@/components/reusables/BottomSheetMenu/MenuModal';
import { IMenuItemProps } from '@/components/reusables/BottomSheetMenu/MenuItem';
import { CommonActions } from '@react-navigation/native';

const AlbumPage: React.FC = () => {
  // For Album Data
  const { currentUser } = useAuthStore();
  const { id } = useLocalSearchParams();
  const [albumDetails, setAlbumDetails] = useState<IAlbumDetails | undefined>();
  const {
    getAlbumById: {
      data: albumData,
      refetch: refetchAlbumDetails,
      isRefetching: isRefetchingAlbumDetails,
    },
    toggleSaveAlbum,
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

  const bgOpacity = useSharedValue(0.0);

  const backgroundViewAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const imageContainerScale = useSharedValue(1);

  const imageContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageContainerScale.value }],
  }));
  const [paddingTop, setPaddingTop] = useState<number>(0);

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
  const [isAlbumOptionsModalVisible, setIsAlbumOptionsModalVisible] =
    useState<boolean>(false);

  const albumOptions: IMenuItemProps[] = useMemo(() => {
    if (!albumDetails) return [];
    let options: IMenuItemProps[] = [
      {
        label: 'Share',
        onPress: () => {},
        icon: 'share',
      },
      {
        label: 'See Artist Profile',
        onPress: () => {
          setIsAlbumOptionsModalVisible(false);
          navigation.dispatch(
            CommonActions.navigate('Profile', {
              id: albumDetails?.creator?.id,
            })
          );
        },
        icon: 'person',
      },
    ];

    if (albumDetails?.creator?.id === currentUser?.id) {
      options.push({
        label: 'Update Album',
        onPress: () => {
          setIsAlbumOptionsModalVisible(false);
          navigation.dispatch(
            CommonActions.navigate('UpdateAlbum', {
              id: albumDetails?.id,
            })
          );
        },
        icon: 'edit',
      });
    } else if (albumDetails.isSaved) {
      options.push({
        label: 'Unsave',
        onPress: () => {
          toggleSaveAlbum.mutate(albumDetails?.id);
        },
        icon: 'delete',
      });
    }
    return options;
  }, [albumDetails, currentUser]);

  return (
    <Container statusBarPadding={false}>
      <MenuModal
        visible={isAlbumOptionsModalVisible}
        onClose={() => setIsAlbumOptionsModalVisible(false)}
        items={albumOptions}
        header={albumDetails?.title}
      />
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
          { zIndex: 1, height: albumCoverWidth * 0.8 },
          imageContainerAnimatedStyle,
        ]}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setAlbumCoverWidth(width);
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
          height={albumCoverWidth * 0.8}
          source={albumDetails?.cover}
        />
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
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setPaddingTop(height);
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
        <BackNavigator
          showBackText
          style={{
            paddingVertical: 0,
            paddingHorizontal: 4,
          }}
          rightComponent={
            <AnimatedTouchable
              wrapperClassName="flex flex-row items-center px-4 py-1"
              onPress={() => setIsAlbumOptionsModalVisible(true)}
              disableInitialAnimation
            >
              <MaterialIcons
                name="more-vert"
                size={30}
                color={COLORS.neutral.light}
              />
            </AnimatedTouchable>
          }
        />
        <AnimatedTouchable
          disableInitialAnimation
          wrapperClassName="flex flex-row items-center px-4 py-1"
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
              albumCoverWidth * 0.7
            );

            const newValue = percentage / 100;
            bgOpacity.value = withSpring(newValue, {
              damping: 5,
              stiffness: 50,
            });

            imageContainerScale.value = withSpring(1 + newValue, {
              damping: 10,
              stiffness: 50,
            });
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
          stickyHeaderIndices={[1]}
        >
          {/* </GestureDetector> */}
          {/* User's Public Contents */}

          <View className="mt-44" />

          {/* Album Details */}
          <Animated.View
            className="flex flex-row p-4 justify-between relative"
            style={[
              {
                zIndex: 10,
                paddingTop,
              },
            ]}
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
            <View className="flex flex-col">
              <StyledText
                size="4xl"
                weight="bold"
                tracking="tight"
                color={COLORS.neutral.light}
              >
                {albumDetails?.title}
              </StyledText>
              <StyledText
                size="base"
                weight="semibold"
                tracking="tight"
                color={COLORS.neutral.normal}
                className="mt-1"
              >
                {`Album  •  ${
                  albumDetails?._count?.savedBy || 0
                } Saves  •  ${getYear(albumDetails?.createdAt)}`}
              </StyledText>
            </View>

            <TogglePlayButton
              size={40}
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
          </Animated.View>

          <View
            className="flex flex-1 relative"
            style={{
              paddingHorizontal: 12,
              paddingVertical: 4,
            }}
          >
            {/* Tracks */}
            <View className="flex flex-col my-2">
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
                    />
                  }
                />
              </View>
              <View className="flex flex-row justify-between items-center w-full mb-5 mt-8">
                <StyledText
                  size="lg"
                  weight="bold"
                  tracking="tight"
                  color={COLORS.neutral.light}
                >
                  Tracks ({albumDetails?._count?.tracks || 0})
                </StyledText>
                <FlatList
                  horizontal
                  renderItem={({ item, index }) => (
                    <Capsule
                      key={(item?.id as string) + index}
                      text={item?.name || ''}
                      selected={index === 0}
                    />
                  )}
                  data={
                    [
                      albumDetails?.genre,
                      ...(albumDetails?.tags ? albumDetails?.tags : []),
                    ] || []
                  }
                  bounces
                  alwaysBounceHorizontal
                  contentContainerStyle={{
                    maxWidth: '50%',
                    marginLeft: 'auto',
                  }}
                />
              </View>

              <FlatList
                renderItem={({ item: track, index }) => (
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
                )}
                data={albumDetails?.tracks || []}
                bounces
                alwaysBounceVertical
              />
            </View>
          </View>
          <TextContainer
            text={albumDetails?.description}
            heading="About this Album"
            padding={[18, 8]}
          />
        </ScrollView>
      </View>
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
