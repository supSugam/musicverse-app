import { ReviewStatus } from '../enums/ReviewStatus';
import { ITrack } from './ITrack';

export interface IAlbum {
  title: string;
  description?: string;
  cover?: File;
  genreId: string;
  releaseDate: string;
  tracks: ITrack[];
  tags?: string[];
  publicStatus?: ReviewStatus;
}
