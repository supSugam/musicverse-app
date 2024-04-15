import { ReviewStatus } from '../enums/ReviewStatus';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ARTIST = 'ARTIST',
  MEMBER = 'MEMBER',
}

export interface ICurrentUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  isVerified: boolean;
  iat: number;
  exp: number;
  accessToken: string;
}

export interface IUserCountStats {
  albums: number;
  tracks: number;
  playlists: number;
  followers: number;
  following: number;
}
export interface IUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  artistStatus: ReviewStatus;
  _count?: IUserCountStats;
  isFollowing?: boolean;
  isFollower?: boolean;
  isMe?: boolean;
}

export interface IUserProfile {
  avatar: string | null;
  bio: string | null;
  cover: string | null;
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
  userId: string;
}

export interface IUserWithProfile extends IUser {
  profile: IUserProfile;
}
