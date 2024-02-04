export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ARTIST = 'ARTIST',
}

export interface ICurrentUser {
  id: string;
  email: string;
  username: string;
  role: string;
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
