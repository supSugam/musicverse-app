import { SuccessResponse } from './IApiResponse';
import { ITag } from './ITag';
import { ITrackDetails } from './ITrack';
import { IUserWithProfile } from './IUser';
import { ReviewStatus } from '../enums/ReviewStatus';

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
  publicStatus: ReviewStatus;
  creator?: IUserWithProfile;
  tags?: ITag[];
  _count: Counts;
  isSaved: boolean;
  tracks?: ITrackDetails[];
  savedBy?: IUserWithProfile[];
  collaborators?: IUserWithProfile[];
  type?: string;
  genre: undefined;
}

export interface Counts {
  savedBy: number;
  collaborators: number;
  tracks: number;
}

export interface IInvitationToken {
  id: string;
  playlistId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
