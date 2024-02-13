import { AssetWithDuration } from '@/hooks/useAssetsPicker';

export interface ITrack {
  title: string;
  description?: string;
  src: string;
  preview?: string;
  cover?: string;
  lyrics?: string;
  genreId: string;
  tags?: string[];
  isPublic: boolean;
  trackSource: AssetWithDuration;
}
