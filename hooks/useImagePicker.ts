import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { toastResponseMessage } from '@/utils/toast';

interface IImagePickerProps {
  allowsEditing?: boolean;
  selectionLimit?: number;
  quality?: number;
  aspect?: [number, number];
  mediaTypes?: ImagePicker.MediaTypeOptions;
}

export const useImagePicker = ({
  allowsEditing = false,
  selectionLimit = 1,
  quality = 1,
  aspect = [1, 1],
  mediaTypes = ImagePicker.MediaTypeOptions.Images,
}: IImagePickerProps) => {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset[] | null>(
    null
  );

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      toastResponseMessage({
        content: 'Permission to access camera roll is required!',
        type: 'error',
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing,
      aspect,
      quality,
      selectionLimit,
      allowsMultipleSelection: selectionLimit > 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets);
    }
  };

  return { image, pickImage };
};
