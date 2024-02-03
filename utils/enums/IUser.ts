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
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: IUser;
}
