import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { toastResponseMessage } from '@/utils/toast';

interface IAudioPickerProps {
  selectionLimit?: number;
  mediaTypes?: string[];
}

export const useAssetsPicker = ({
  selectionLimit = 1,
  mediaTypes = ['audio/wav', 'audio/mpeg'],
}: IAudioPickerProps) => {
  const [assets, setAssets] = useState<
    DocumentPicker.DocumentPickerAsset[] | null
  >(null);

  const pickAssets = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: mediaTypes,
        multiple: selectionLimit > 1,
      });

      if (!result.canceled) {
        const pickedAssets = Array.isArray(result.assets)
          ? result.assets.slice(0, selectionLimit)
          : [result.assets];
        setAssets(pickedAssets);
        console.log(pickedAssets);
      } else {
        console.log('Document picking cancelled');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      toastResponseMessage({
        content: 'Error picking document',
        type: 'error',
      });
    }
  };

  return { assets, pickAssets };
};
