import { AssetWithDuration } from '@/hooks/useAssetsPicker';

export enum ReviewStatus {
  REQUESTED = 'REQUESTED',
  NOT_REQUESTED = 'NOT_REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface ITrack {
  title: string;
  description?: string;
  src: string;
  preview?: string;
  cover?: string;
  lyrics?: string;
  genreId: string;
  tags?: string[];
  publicStatus?: ReviewStatus;
  trackSource: AssetWithDuration;
  trackDuration: string;
  previewSource: AssetWithDuration;
}
