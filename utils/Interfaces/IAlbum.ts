import { ImageWithRotation } from '@/hooks/useImagePicker';
import { ReviewStatus } from '../enums/ReviewStatus';
import { ITrack, ITrackDetails } from './ITrack';
import { IFilePayload } from './IFilePayload';
import { IGenre } from './IGenre';
import { ITag } from './ITag';
import { SuccessResponse } from './IApiResponse';
import { IUserProfile, IUserWithProfile } from './IUser';

export interface IAlbum {
  title: string;
  description?: string;
  cover?: IFilePayload;
  genreId: string;
  tracks: ITrack[];
  tags?: string[];
  publicStatus?: ReviewStatus;
}

export interface ICreateAlbumPayload extends Omit<IAlbum, 'tracks' | 'cover'> {
  cover?: IFilePayload;
}

export interface IUpdateAlbumPayload extends Partial<ICreateAlbumPayload> {}

export interface IAlbumDetails {
  id: string;
  title: string;
  description: string | null;
  cover: string | null;
  createdAt: string;
  updatedAt: string;
  genreId: string;
  publicStatus: ReviewStatus;
  creatorId: string;
  _count: {
    tracks: number;
    tags: number;
    savedBy: number;
  };
  creator?: IUserWithProfile;
  genre?: IGenre;
  tags?: ITag[];
  tracks?: ITrackDetails[];
  savedBy?: IUserProfile[];
}
export interface IGetAllAlbumsResponse {
  items: IAlbumDetails[];
  totalCount: number;
}

export type GetAllAlbumsResponse = SuccessResponse<IGetAllAlbumsResponse>;
