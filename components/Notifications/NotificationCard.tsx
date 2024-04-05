import { View, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import {
  INotification,
  NotificationType,
} from '@/utils/Interfaces/INotification';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import COLORS from '@/constants/Colors';
import Animated from 'react-native-reanimated';
import ImageDisplay from '../reusables/ImageDisplay';
import {
  ALBUM_PLACEHOLDER_IMAGE,
  DEFAULT_AVATAR,
  PLAYLIST_PLACEHOLDER_IMAGE,
  TRACK_PLACEHOLDER_IMAGE,
} from '@/utils/constants';
import DarkGradient from '../Playlist/DarkGradient';
import StyledText from '../reusables/StyledText';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface INotifCardProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  index: number;
  notificationDetails: INotification;
}
const NotificationCard = ({
  index,
  notificationDetails,
  ...rest
}: INotifCardProps) => {
  const { type, title, body, read } = notificationDetails;

  const imageSource = useMemo(() => {
    if (
      type === NotificationType.NEW_PLAYLIST ||
      type === NotificationType.SAVE_PLAYLIST ||
      type === NotificationType.COLLABORATE_PLAYLIST
    ) {
      return PLAYLIST_PLACEHOLDER_IMAGE;
    } else if (
      type === NotificationType.NEW_ALBUM ||
      type === NotificationType.SAVE_ALBUM
    ) {
      return ALBUM_PLACEHOLDER_IMAGE;
    } else if (
      type === NotificationType.NEW_TRACK ||
      type === NotificationType.LIKE_TRACK ||
      NotificationType.DOWNLOAD_TRACK
    ) {
      return TRACK_PLACEHOLDER_IMAGE;
    } else if (type === NotificationType.FOLLOW) {
      return DEFAULT_AVATAR;
    }
  }, [type]);

  const relatedIcon: keyof typeof MaterialIcons.glyphMap = useMemo(() => {
    if (
      type === NotificationType.SAVE_PLAYLIST ||
      type === NotificationType.SAVE_ALBUM
    ) {
      return 'playlist-add';
    } else if (
      type === NotificationType.NEW_ALBUM ||
      type === NotificationType.NEW_PLAYLIST ||
      type === NotificationType.NEW_TRACK
    ) {
      return 'library-music';
    } else if (type === NotificationType.DOWNLOAD_TRACK) {
      return 'download';
    } else if (type === NotificationType.FOLLOW) {
      return 'person-add';
    } else if (type === NotificationType.COLLABORATE_PLAYLIST) {
      return 'offline-pin';
    } else if (type === NotificationType.LIKE_TRACK) {
      return 'library-music';
    }
    return 'home';
  }, [type]);
  // type === NotificationType.COLLABORATE_PLAYLIST

  const onNotificationPress = () => {};

  return (
    <AnimatedTouchable duration={index * 200} className="w-full" {...rest}>
      <Animated.View style={styles.wrapper}>
        <View
          style={[
            styles.imageContainer,
            type === NotificationType.FOLLOW && styles.borderRadiusFull,
          ]}
        >
          <ImageDisplay
            source={imageSource}
            width="100%"
            height="100%"
            shadows
          />
          <DarkGradient
            styles={{
              zIndex: 1,
            }}
            opacity={0.5}
          />

          <View style={styles.icon}>
            <MaterialIcons
              color={COLORS.neutral.light}
              size={20}
              name={relatedIcon}
            />
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <StyledText
            color={COLORS.neutral.light}
            size="base"
            weight="semibold"
            numberOfLines={1}
          >
            {title}
          </StyledText>
          <StyledText
            color={COLORS.neutral.light}
            opacity="high"
            size="sm"
            weight="light"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {body}
          </StyledText>
        </View>

        <View
          style={[
            styles.dot,
            !read && { backgroundColor: COLORS.primary.light },
          ]}
        />
      </Animated.View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.neutral.dense,
    borderColor: COLORS.neutral.semidark,
    borderBottomWidth: 1,
  },
  imageContainer: {
    height: 50,
    width: 50,
    overflow: 'hidden',
    borderRadius: 6,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  borderRadiusFull: {
    borderRadius: 999,
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 18,
  },

  icon: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    position: 'relative',
    backgroundColor: COLORS.neutral.gray,
    marginRight: 6,
    overflow: 'hidden',
  },
});

export default NotificationCard;
