import { ITrack } from './ITrack';

export interface IAlbum {
  title: string;
  description?: string;
  cover?: string;
  genreId: string;
  releaseDate: string;
  tracks: ITrack[];
  tags?: string[];
}
