import { ImageWithRotation } from '@/hooks/useImagePicker';
import { ReviewStatus } from '../enums/ReviewStatus';
import { ITrack } from './ITrack';
import { IFilePayload } from './IFilePayload';

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
