import { AssetWithDuration } from '@/hooks/useAssetsPicker';
import { ReviewStatus } from '../enums/ReviewStatus';
import { ImagePickerAsset } from 'expo-image-picker';

export interface ITrack {
  title: string;
  description?: string;
  src: AssetWithDuration;
  preview?: AssetWithDuration;
  cover?: ImagePickerAsset;
  lyrics?: string;
  publicStatus?: ReviewStatus;
  trackDuration: string; // in seconds
  previewDuration: string;
  trackSize: string; // in bytes
  genreId: string;
  tags?: string[];
}
