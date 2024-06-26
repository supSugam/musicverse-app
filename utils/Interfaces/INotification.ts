import { IUserWithProfile } from './IUser';

export enum NotificationType {
  FOLLOW = 'FOLLOW',
  DOWNLOAD_TRACK = 'DOWNLOAD_TRACK',
  LIKE_TRACK = 'LIKE_TRACK',
  SAVE_PLAYLIST = 'SAVE_PLAYLIST',
  SAVE_ALBUM = 'SAVE_ALBUM',
  COLLABORATE_PLAYLIST = 'COLLABORATE_PLAYLIST',
  NEW_TRACK = 'NEW_TRACK',
  NEW_ALBUM = 'NEW_ALBUM',
  NEW_PLAYLIST = 'NEW_PLAYLIST',
  TRACK_PUBLIC_APPROVED = 'TRACK_PUBLIC_APPROVED',
}

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  imageUrl?: string | null;
  read: boolean;
  time: string;
  recipientId: string;
  triggerUserId: string;
  destinationId: string;
  triggerUser?: IUserWithProfile;
}
