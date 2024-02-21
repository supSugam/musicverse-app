import { AssetWithDuration } from '@/hooks/useAssetsPicker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { IFilePayload } from '../Interfaces/IFilePayload';
import { ImageWithRotation } from '@/hooks/useImagePicker';

interface IFileInfoProps {
  name: string;
  extension: string;
  originalFilename: string;
}

export const getFileInfoFromUri = (uri: string): IFileInfoProps => {
  // Get the filename from the URI
  const filename = uri.split('/').pop() || '';
  // Extract the name without extension
  const name = filename.split('.').slice(0, -1).join('.');
  // Extract the extension
  const extension = filename.split('.').pop() || '';
  // Set the original filename to the same as the name for now
  const originalFilename = filename;

  return {
    name,
    extension,
    originalFilename,
  };
};

export const assetToFile = (
  asset?: AssetWithDuration | DocumentPickerAsset | null
): IFilePayload | null => {
  if (!asset) return null;
  const uri = asset.uri;
  const fileInfo = getFileInfoFromUri(uri);
  const type = asset.mimeType || asset.file?.type || '';
  const name = fileInfo.originalFilename;

  return {
    uri,
    name,
    type,
  };
};

export const imageAssetToFile = (
  asset?: ImagePickerAsset | ImageWithRotation | null
): IFilePayload | null => {
  if (!asset) return null;

  const fileInfo = getFileInfoFromUri(asset.uri);
  const uri = asset.uri;
  const type = asset.mimeType || asset.type || '';
  const name = fileInfo.originalFilename;
  return {
    uri,
    name,
    type,
  };
};
