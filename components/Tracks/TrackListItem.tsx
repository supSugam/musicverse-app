import { View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import StyledText from '../reusables/StyledText';
import ImageDisplay from '../reusables/ImageDisplay';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import MenuModal from '../reusables/BottomSheetMenu/MenuModal';
import TrackPreview from './TrackPreview';
import { toastResponseMessage } from '@/utils/toast';
import HorizontalMarquee from '../reusables/HorizontalMarquee';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { IMenuItemProps } from '../reusables/BottomSheetMenu/MenuItem';
import { useDownloadTrack } from '@/hooks/useDownloadTrack';

interface ITrackListItemProps {
  id: string;
  title: string;
  artistName?: string;
  artistId?: string;
  cover: string | null;
  duration: number;
  onPlayClick?: () => void;
  isPlaying?: boolean;
  isLiked?: boolean;
  label?: string | number;
  isBuffering?: boolean;
  options?: IMenuItemProps[];
  onOptionsClick?: () => void;
  optionsVisible?: boolean;
  index?: number;
}

const TrackListItem = ({
  id,
  title,
  artistName,
  artistId,
  cover,
  duration,
  label,
  isLiked = false,
  onPlayClick,
  isPlaying,
  isBuffering = false,
  options,
  onOptionsClick,
  optionsVisible,
  index,
}: ITrackListItemProps) => {
  const translateX = useSharedValue(200);
  const opacity = useSharedValue(0);

  // Favorite button animations
  const favoriteButtonScale = useSharedValue(1);
  const playButtonOpacity = useSharedValue(0);

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    translateX.value = withDelay(
      (index ? index + 1 : 1) * 100,
      withTiming(0, { duration: 500 })
    );
    opacity.value = withDelay(
      (index ? index + 1 : 1) * 100,
      withTiming(1, { duration: 500 })
    );
  }, [duration, index]);

  const favoriteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteButtonScale.value }],
  }));

  useEffect(() => {
    const id = setInterval(() => {
      playButtonOpacity.value = withTiming(isBuffering ? 0 : 1, {
        duration: 200,
      });
    }, 200);

    return () => clearInterval(id);
  }, [isBuffering]);

  // Options Menu

  const [optionsMenuVisible, setOptionsMenuVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof optionsVisible === 'boolean')
      setOptionsMenuVisible(optionsVisible);
  }, [optionsVisible]);

  // API

  const {
    toggleLike: { mutate: toggleLikeMutate, isPending },
  } = useTracksQuery({ id });

  const { isTrackDownloaded, deleteTrack, downloadAndSaveTrack } =
    useDownloadTrack();

  const navigation = useNavigation();
  return (
    <>
      <MenuModal
        visible={optionsMenuVisible}
        onClose={() => setOptionsMenuVisible(false)}
        header={
          <TrackPreview
            id={id}
            title={title}
            artistName={artistName}
            cover={cover}
            duration={duration}
          />
        }
        items={
          options || [
            {
              label: 'Add to Playlists',
              onPress: () => {
                setOptionsMenuVisible(false);
                navigation.dispatch(
                  CommonActions.navigate('AddToPlaylist', {
                    screen: 'AddToPlaylistSC1',
                    params: {
                      track: {
                        id,
                        title,
                        creator: { username: artistName },
                        cover,
                        trackDuration: duration,
                      },
                    },
                  })
                );
              },
              icon: 'playlist-add',
            },

            {
              label: isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs',
              onPress: () => {
                toggleLikeMutate(id);
              },
              icon: isLiked ? 'favorite' : 'favorite-border',
            },
            {
              label: 'See Artist Profile',
              onPress: () => {
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'ProfilePage',
                    params: { username: artistId },
                  })
                );
              },
              icon: 'person',
            },
            {
              label: 'Share',
              onPress: () => {},
              icon: 'share',
            },
            {
              label: isTrackDownloaded(id)
                ? 'Delete from Downloads'
                : 'Download',
              onPress: async () => {
                if (isTrackDownloaded(id)) {
                  await deleteTrack(id);
                } else {
                  await downloadAndSaveTrack(id);
                }
                setOptionsMenuVisible(false);
              },
              icon: isTrackDownloaded(id) ? 'delete' : 'download',
            },
          ]
        }
      />
      <Animated.View
        style={[
          translateStyle,
          {
            zIndex: 1,
            height: 65,
            backgroundColor: `${COLORS.neutral.dark}80`,
          },
        ]}
        className="flex w-full flex-row items-center justify-between p-2 mb-2 rounded-lg"
      >
        <View className="flex flex-row items-center flex-1">
          {label !== undefined && (
            <StyledText
              size="sm"
              weight="semibold"
              style={{
                color: COLORS.neutral.normal,
              }}
              className="mr-4"
            >
              {label}
            </StyledText>
          )}
          <ImageDisplay
            source={cover ? { uri: cover } : TRACK_PLACEHOLDER_IMAGE}
            placeholder={''}
            width={50}
            height={50}
            borderRadius={4}
            style={{
              borderColor: COLORS.neutral.semidark,
              borderWidth: 1,
            }}
          />

          <View className="flex flex-col mx-3 mr-5 flex-1">
            <HorizontalMarquee speed={5000} pauseDuration={2000}>
              <StyledText
                size="base"
                weight="medium"
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {title}
              </StyledText>
            </HorizontalMarquee>
            <StyledText
              size="sm"
              weight="light"
              style={{
                color: COLORS.neutral.light,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
              onPress={() => {
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'ProfilePage',
                    params: { username: artistId },
                  })
                );
              }}
            >
              {artistName}
            </StyledText>
          </View>
          <View className="flex flex-row items-center ml-auto justify-end">
            {onPlayClick && (
              <Animated.View style={favoriteButtonStyle}>
                <TouchableOpacity
                  className="mr-2"
                  onPress={onPlayClick}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name={isPlaying ? 'pause' : 'play-arrow'}
                    size={28}
                    color={COLORS.neutral.light}
                  />
                </TouchableOpacity>
              </Animated.View>
            )}

            <TouchableOpacity
              className="ml-1"
              onPress={() => {
                if (onOptionsClick) {
                  onOptionsClick();
                } else {
                  setOptionsMenuVisible(true);
                }
              }}
            >
              <MaterialIcons
                name="more-vert"
                size={24}
                color={COLORS.neutral.light}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default TrackListItem;

// {
//    <LottieView
// source={PlayingMusicLA}
// autoPlay
// loop
// speed={0.8}
// style={{
//   alignSelf: 'center',
//   transform: [{ scaleX: 5 }, { scaleY: 5 }],
//   width: 42,
//   height: 42,
// }}
// />
// }
