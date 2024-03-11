import { SuccessResponse } from './IApiResponse';
import { IGenre } from './IGenre';
import { ITag } from './ITag';
import { ITrackDetails } from './ITrack';
import { IUserWithProfile } from './IUser';

export interface IGetAllPlaylistsResponse {
  items: IPlaylistDetails[];
  totalCount: number;
}

export type GetAllPlaylistsResponse = SuccessResponse<IGetAllPlaylistsResponse>;

export interface IPlaylistDetails {
  id: string;
  title: string;
  description: string | null;
  cover: string | null;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  publicStatus: string;
  creator?: IUserWithProfile;
  tags?: ITag[];
  _count: Counts;
  isSaved: boolean;
  tracks?: ITrackDetails[];
  savedBy?: IUserWithProfile[];
  collaborators?: IUserWithProfile[];
}

export interface Counts {
  savedBy: number;
  collaborators: number;
  tracks: number;
}
