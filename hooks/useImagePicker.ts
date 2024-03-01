import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { toastResponseMessage } from '@/utils/toast';
import { ALLOWED_IMAGE_MIMETYPES } from '@/utils/constants';

interface IImagePickerProps {
  allowsEditing?: boolean;
  selectionLimit?: number;
  quality?: number;
  aspect?: [number, number];
  mediaTypes?: ImagePicker.MediaTypeOptions;
  onImageSelected?: (image: ImageWithRotation[]) => void;
}

export type ImageWithRotation = ImagePicker.ImagePickerAsset & {
  rotation?: number;
};

export const useImagePicker = ({
  allowsEditing = false,
  selectionLimit = 1,
  quality = 1,
  aspect = [1, 1],
  mediaTypes = ImagePicker.MediaTypeOptions.Images,
  onImageSelected,
}: IImagePickerProps) => {
  const [image, setImage] = useState<ImageWithRotation[] | null>(null);

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

    if (!result.canceled) {
      if (
        !result.assets.every((image) =>
          ALLOWED_IMAGE_MIMETYPES.includes(image?.mimeType || '')
        )
      ) {
        toastResponseMessage({
          content: `Only png, jpg, jpeg images are allowed`,
          type: 'error',
        });
        return;
      }
      setImage(result.assets);
      onImageSelected?.(result.assets);
    }
  };

  const deleteImageByIndex = (index: number) => {
    if (image) {
      const newImage = image.filter((_, i) => i !== index);
      setImage(newImage);
    }
  };

  const deleteAllImages = () => {
    setImage(null);
  };

  const reselectImage = () => {
    pickImage();
  };

  return {
    image,
    pickImage,
    deleteImageByIndex,
    deleteAllImages,
    reselectImage,
  };
};
