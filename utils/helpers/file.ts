import { AssetWithDuration } from '@/hooks/useAssetsPicker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { IFilePayload } from '../Interfaces/IFilePayload';
import { ImageWithRotation } from '@/hooks/useImagePicker';

export const assetToFile = (
  asset?: AssetWithDuration | DocumentPickerAsset | null
): IFilePayload => {
  if (!asset) {
    return {
      uri: '',
      type: '',
      name: '',
    };
  }
  const uri = asset.uri;
  const type = asset.mimeType || asset.file?.type || '';
  const name = asset.name || asset.file?.name || 'Untitled';

  return {
    uri,
    type,
    name,
  };
};

export const imageAssetToFile = (
  asset?: ImagePickerAsset | ImageWithRotation | null
): IFilePayload => {
  if (!asset) {
    return {
      uri: '',
      type: '',
      name: '',
    };
  }
  const uri = asset.uri;
  const type = asset.mimeType || asset.type || '';
  const name = asset.fileName || 'Untitled';

  return {
    uri,
    type,
    name,
  };
};
