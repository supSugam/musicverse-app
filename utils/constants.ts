import axios from 'axios';
import { BASE_URL } from '@env';
import 'react-native-get-random-values';
import { v4 } from 'uuid';
import { UserRole } from './Interfaces/IUser';
import * as FileSystem from 'expo-file-system';
export const api = axios.create({
  baseURL: BASE_URL ?? 'https://uajgu6utdks5.share.zrok.io/api',
});

export const UPLOAD_KEY = 'uploadKey' as const;

export const USER_LIMITS = {
  getMaxTrackSize: (role?: UserRole) =>
    role === UserRole.ARTIST || role === UserRole.MEMBER
      ? 200 * 1024 * 1024
      : 20 * 1024 * 1024,
  MAX_TRACKS_PER_ALBUM: 10,
  getMaxTrackPreviewSize: (role?: UserRole) =>
    role === UserRole.ARTIST || role === UserRole.MEMBER
      ? 100 * 1024 * 1024
      : 10 * 1024 * 1024,
};
export const USER_PERMISSIONS = {
  canPublicUpload: (role: UserRole) => role === UserRole.ARTIST,
  canCreatePublicPlaylist: (role: UserRole) =>
    role === UserRole.ARTIST || role === UserRole.MEMBER,
  canCreateAlbums: (role?: UserRole) => role === UserRole.ARTIST,
};

export const GLOBAL_STYLES = {
  getDisabledStyles: (disabled: boolean) => ({
    opacity: disabled ? 0.7 : 1,
  }),
  BOTTOM_TAB_BAR_HEIGHT: 70,
};
export const uuid = () => v4();

export const ALLOWED_IMAGE_MIMETYPES = ['image/png', 'image/jpg', 'image/jpeg'];
export const ALLOWED_AUDIO_MIMETYPES = [
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/x-wav',
  'audio/wave',
];

export const TRACK_PLACEHOLDER_IMAGE = require('@/assets/images/placeholder/track.jpg');
export const PLAYLIST_PLACEHOLDER_IMAGE = require('@/assets/images/placeholder/track.jpg');
export const ALBUM_PLACEHOLDER_IMAGE = require('@/assets/images/placeholder/track.jpg');
export const DEFAULT_AVATAR = require('@/assets/images/avatar.jpeg');
export const MEMBERSHIP_IMAGE = require('@/assets/images/membership.png');
export const TAB_ROUTE_NAMES = [
  'Home',
  'Search',
  'Feed',
  'MyLibrary',
  'Upload',
  'ProfilePage',
] as const;

// Player

export const PLAYBACK_SPEEDS: { label: string; value: number }[] = [
  {
    label: '0.25x',
    value: 0.25,
  },
  {
    label: '0.5x',
    value: 0.5,
  },
  {
    label: '0.75x',
    value: 0.75,
  },

  {
    label: 'Normal',
    value: 1,
  },
  {
    label: '1.25x',
    value: 1.25,
  },
  {
    label: '1.5x',
    value: 1.5,
  },
  {
    label: '1.75x',
    value: 1.75,
  },
  {
    label: '2x',
    value: 2,
  },
];

export const SLEEP_TIMER_OPTIONS = {
  None: null,
  '10 Seconds': 10,
  '15 Minutes': 15 * 60,
  '30 Minutes': 30 * 60,
  '45 Minutes': 45 * 60,
  '1 Hour': 60 * 60,
} as const;

export type SleepTimerLabel = keyof typeof SLEEP_TIMER_OPTIONS;

export const Downloaded_Tracks_Paths = {
  TRACKS_DIR: `${FileSystem.documentDirectory}Music`,
  TRACK_DIR: (id: string) => `${FileSystem.documentDirectory}Music/${id}`,
  TRACK_SRC: (id: string, fileName: string) =>
    `${FileSystem.documentDirectory}Music/${id}/${fileName}`,
  TRACK_COVER: (id: string, fileName: string) =>
    `${FileSystem.documentDirectory}Music/${id}/${fileName}`,
  TRACK_ARTIST_AVATAR: (id: string, fileName: string) =>
    `${FileSystem.documentDirectory}Music/${id}/${fileName}`,
};

export const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case UserRole.USER:
      return 'Listener';
    case UserRole.ARTIST:
      return 'Artist';
    case UserRole.MEMBER:
      return 'Listener';
    case UserRole.ADMIN:
      return 'Admin';
    default:
      return 'User';
  }
};

export const PLAYBACK_PERCENTAGE_TO_TRIGGER_PLAY = 10 as const;

export const MEMBERSHIP_BENEFITS = (forArtist = false) => [
  'Enjoy unlimited downloads and plays.',
  'Share your music publicly.',
  'Artist Eligibility & Membership Badge.',
  'Access exclusive player features.',
  'Upload songs up to 200MB.',
  ...(forArtist ? ['Upload Albums + Verified Badge'] : []),
];
