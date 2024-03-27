import axios from 'axios';
import { BASE_URL } from '@env';
import 'react-native-get-random-values';
import { v4 } from 'uuid';
import { UserRole } from './Interfaces/IUser';
import * as FileSystem from 'expo-file-system';
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

export const Downloaded_Tracks_Paths = {
  TRACKS_DIR: `${FileSystem.documentDirectory}Music`,
  TRACK_DIR: (id: string) => `${FileSystem.documentDirectory}Music/${id}`,
  TRACK_SRC: (id: string, fileName: string) =>
    `${FileSystem.documentDirectory}Music/${id}/${fileName}`,
  TRACK_COVER: (id: string, fileName: string) =>
    `${FileSystem.documentDirectory}Music/${id}/${fileName}`,
  TRACK_ARTIST_AVATAR: (id: string, fileName: string) =>
    `${FileSystem.documentDirectory}Music/${id}/${fileName}`,
} as const;

// use expo sqlite then.

// User should be able to download tracks.
// Track details: export interface IUserProfile { avatar: string | null; cover: string | null; createdAt: string; id: string; name: string; userId: string; } export interface IUserWithProfile{ id: string; email: string; username: string; role: UserRole; isVerified: boolean; profile: IUserProfile; } export interface ITrackDetails { id: string; title: string; description: string | null; src: string; // this is a audio link (you have to download and save this) cover: string | null; // this is a image link (you have to download and save this as well) lyrics: string | null; // this ican be large text, publicStatus: string; trackDuration: number; trackSize: number; creator: IUserWithProfile; plays?: number; createdAt: string; downloaded?: boolean; downloadedAt?: string; }
// make a useDownloadTrack hook that will handle everything from saving tracks and related info to storing them and retreiving or deleting them. react native expo, typescript, use expo's libraries, generate full working code fully, download should be done with using axios, also a progress percentage of type number ranging from 1-100, isDownloading bool, cancel download method, and edit filepath according to this new design:
// export const DOWNLOADED_TRACK_PATHS = {
//   TRACKS_DIR: `${FileSystem.documentDirectory}Music`,
//   TRACK_DIR: (id: string) => `${FileSystem.documentDirectory}Music/${id}`,
//   TRACK_SRC: (id: string, fileName: string) =>
//     `${FileSystem.documentDirectory}Music/${id}/${fileName}`,
//   TRACK_COVER: (id: string, fileName: string) =>
//     `${FileSystem.documentDirectory}Music/${id}/${fileName}`,
//   TRACK_ARTIST_AVATAR: (id: string, fileName: string) =>
//     `${FileSystem.documentDirectory}Music/${id}/${fileName}`,
// };
//  also you were wrong about filesystem stuff, for example: Property 'path' does not exist on type 'typeof import("c:/Users/sugam/OneDrive/Documents/Year 3rd/FYP/musicverse-app/node\_modules/expo-file-system/build/index")', use the latest version of expo-file-system
//  and generate me full working code
