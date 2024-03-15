import axios from 'axios';
import { BASE_URL } from '@env';
import 'react-native-get-random-values';
import { v4 } from 'uuid';
import { UserRole } from './Interfaces/IUser';

export const api = axios.create({
  baseURL: BASE_URL,
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

export const TAB_ROUTE_NAMES = [
  'Home',
  'Search',
  'Feed',
  'MyLibrary',
  'Upload',
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
