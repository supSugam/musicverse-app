import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { toastResponseMessage } from '@/utils/toast';
import { Audio } from 'expo-av';

interface IAudioPickerProps {
  selectionLimit?: number;
  mediaTypes?: string[];
}
export type AssetWithDuration = DocumentPicker.DocumentPickerAsset & {
  duration?: number;
};

export const useAssetsPicker = ({
  selectionLimit = 1,
  mediaTypes = ['audio/wav', 'audio/mpeg', 'audio/x-wav'],
}: IAudioPickerProps) => {
  const pickAssets = async (): Promise<AssetWithDuration[] | null> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: mediaTypes,
        multiple: selectionLimit > 1,
      });

      if (!result.canceled) {
        const pickedAssets = Array.isArray(result.assets)
          ? result.assets.slice(0, selectionLimit)
          : [result.assets];

        const assetsWithDuration = await Promise.all(
          pickedAssets.map(async (asset) => {
            // if check match for audio/* or video/*
            if (!asset.mimeType?.match(/audio\/|video\//)) {
              return asset;
            }
            try {
              const sound = new Audio.Sound();
              sound._onPlaybackStatusUpdate = (status) => {};
              const soundObject = await sound.loadAsync(asset);
              const duration = soundObject.isLoaded
                ? soundObject.durationMillis
                : 0;
              await sound.unloadAsync();
              return { ...asset, duration };
            } catch (error) {
              console.error('Error getting duration:', error);
              return asset;
            }
          })
        );

        return assetsWithDuration;
      } else {
        console.log('Document picking cancelled');
        return null;
      }
    } catch (error) {
      console.error('Error picking document:', error);
      toastResponseMessage({
        content: 'Error picking document',
        type: 'error',
      });
      return null;
    }
  };

  return { pickAssets };
};
