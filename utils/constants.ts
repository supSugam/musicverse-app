import axios from 'axios';
import { BASE_URL } from '@env';
import 'react-native-get-random-values';
import { v4 } from 'uuid';
import { UserRole } from './enums/IUser';

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
    opacity: disabled ? 0.5 : 1,
  }),
};
export const uuid = () => v4();
