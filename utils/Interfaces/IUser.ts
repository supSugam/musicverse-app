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

export interface IUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  artistStatus: ReviewStatus;
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
