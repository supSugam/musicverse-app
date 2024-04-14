import { IGenre } from './IGenre';
import { ITag } from './ITag';
import { IUserWithProfile } from './IUser';

export enum FeedContentType {
  ALBUM = 'album',
  TRACK = 'track',
  PLAYLIST = 'playlist',
}

export interface IFeedContent {
  id: string;
  createdAt: string;
  creator?: IUserWithProfile;
  cover?: string | null;
  tags?: ITag[];
  type?: FeedContentType;
  genre?: IGenre;
}
