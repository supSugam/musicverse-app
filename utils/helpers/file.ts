import { AssetWithDuration } from '@/hooks/useAssetsPicker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

async function base64StringToFile({
  base64String,
  mimeType,
  fileName,
}: {
  base64String: string;
  mimeType?: string;
  fileName?: string | null;
}): Promise<File> {
  const fn = fileName || 'Untitled';
  return new Promise((resolve, reject) => {
    // Convert the Base64 string to a Uint8Array
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the Uint8Array
    const blob = new Blob([byteArray], { type: mimeType });

    // Create a File from the Blob
    const file = new File([blob], fn, { type: mimeType });

    resolve(file);
  });
}

export const imageAssetToFile = async (
  asset?: ImagePickerAsset
): Promise<File | undefined> => {
  if (!asset || !asset.base64) return undefined;
  const file = await base64StringToFile({
    base64String: asset.base64,
    fileName: asset.fileName,
    mimeType: asset.mimeType,
  });

  return file;
};

export const assetToFile = async (
  asset?: AssetWithDuration | DocumentPickerAsset | null
): Promise<File | undefined> => {
  if (!asset || !asset.file) return undefined;
  const base64String = await FileSystem.readAsStringAsync(asset.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const file = await base64StringToFile({
    base64String,
    fileName: asset.file.name,
    mimeType: asset.mimeType || asset.file.type,
  });

  return file;
};
