import Container from '@/components/Container';
import FadingDarkGradient from '@/components/Playlist/FadingDarkGradient';
import TrackListItem from '@/components/Tracks/TrackListItem';
import AnimatedTouchable from '@/components/reusables/AnimatedTouchable';
import BackButton from '@/components/reusables/BackButton';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import PlayButon from '@/components/reusables/PlayButon';
import StyledText from '@/components/reusables/StyledText';
import COLORS from '@/constants/Colors';
import { useAlbumsQuery } from '@/hooks/react-query/useAlbumsQuery';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import { getYear } from '@/utils/helpers/date';
import { calculatePercentage } from '@/utils/helpers/number';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

const AlbumPage: React.FC = () => {
  // For Album Data
  const { id } = useLocalSearchParams();
  const [albumDetails, setAlbumDetails] = useState<IAlbumDetails | undefined>();

  const {
    getAlbumById: {
      data: albumData,
      refetch: refetchAlbumDetails,
      isRefetching: isRefetchingAlbumDetails,
    },
  } = useAlbumsQuery({
    id: id as string,
  });

  useEffect(() => {
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
    queueId,
    setQueueId,
    isThisPlaying,
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

        {/* <View className="absolute bottom-2 right-4 z-[2]">
          <ImageDisplay
            placeholder={<StyledText>Avatar</StyledText>}
            width={albumCoverWidth * 0.18}
            height={albumCoverWidth * 0.18}
            source={albumDetails?.avatar}
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
        <BackButton showBackText />
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
              albumCoverWidth * 0.7
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
              refreshing={isRefetchingAlbumDetails}
              onRefresh={() => {
                refetchEverything();
              }}
            />
          }
        >
          {/* </GestureDetector> */}
          {/* User's Public Contents */}

          <View className="flex flex-row p-4 mt-64 justify-between">
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
                weight="medium"
                tracking="tight"
                color={COLORS.neutral.normal}
                className="mt-1"
              >
                {`Album • ${albumDetails?.tracks?.length} Tracks • ${getYear(
                  albumDetails?.createdAt
                )}`}
              </StyledText>
            </View>

            <PlayButon
              size={40}
              onPress={() => {
                if (!albumDetails?.tracks) return;
                setQueueId(albumDetails?.id);
                updateTracks(albumDetails?.tracks || []);
                playATrackById(albumDetails?.tracks[0].id);
              }}
              isPlaying={isThisPlaying(albumDetails?.id)}
            />
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
              {albumDetails?.bio}
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
                {[
                  ...(albumDetails?.tracks || []),
                  ...(albumDetails?.tracks || []),
                  ...(albumDetails?.tracks || []),
                  ...(albumDetails?.tracks || []),
                ].map((track, i) => (
                  <TrackListItem
                    key={track.id + i}
                    id={track.id}
                    title={track.title}
                    onPlayClick={async () => {
                      await playATrackById(track.id);
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

export default AlbumPage;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    position: 'relative',
    maxHeight: '100%',
    zIndex: 5,
  },
});
