import { AssetWithDuration } from '@/hooks/useAssetsPicker';
import { ReviewStatus } from '../enums/ReviewStatus';
import { ImagePickerAsset } from 'expo-image-picker';
import { SuccessResponse } from './IApiResponse';
import { IAlbumDetails } from './IAlbum';
import { ITag } from './ITag';
import { IUserWithProfile } from './IUser';
import { IGenre } from './IGenre';

export interface ITrack {
  title: string;
  description?: string;
  src: AssetWithDuration;
  preview?: AssetWithDuration;
  cover?: ImagePickerAsset;
  lyrics?: string;
  publicStatus?: ReviewStatus;
  trackDuration: number; // in seconds
  previewDuration: number;
  trackSize: number; // in bytes
  genreId: string;
  tags?: string[];
  uploadKey: string;
  albumIds?: string[];
}

export interface IGetAllTracksResponse {
  items: ITrackDetails[];
  totalCount: number;
}

export type GetAllTracksResponse = SuccessResponse<IGetAllTracksResponse>;

export interface ITrackDetails {
  id: string;
  title: string;
  description: string | null;
  src: string;
  preview: string | null;
  cover: string | null;
  lyrics: string | null;
  publicStatus: string;
  trackDuration: number;
  previewDuration: number;
  trackSize: number;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  genreId: string;
  genre?: IGenre;
  albums?: IAlbumDetails[];
  //TODO: Add proper type for for playlists and likedBy
  playlists?: any[]; // Lets see
  likedBy?: any[]; // Lets see
  tags?: ITag[];
  creator?: IUserWithProfile;
  isLiked?: boolean;
  downloaded?: boolean;
  downloadedAt?: string;
  _count?: {
    plays: number;
    playlists: number;
    albums: number;
    tags: number;
    likedBy: number;
    downloads: number;
  };
}
