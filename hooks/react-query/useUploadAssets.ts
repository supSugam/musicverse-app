import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
  Method,
} from 'axios';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { ImagePickerAsset } from 'expo-image-picker';
import { assetToFile, imageAssetToFile } from '@/utils/helpers/file';
import { AssetWithDuration } from '../useAssetsPicker';
import { isMyCustomType } from '@/utils/helpers/ts-utilities';
import { IFilePayload } from '@/utils/Interfaces/IFilePayload';
import { ImageWithRotation } from '../useImagePicker';
type Payload = {
  [key: string]: any;
};

type UploadOptions = {
  endpoint: string;
  requestType: 'POST' | 'PATCH';
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: () => void;
  onUploadError?: (error: any) => void;
  onUploadCancel?: () => void;
};

const useUploadAssets = ({
  endpoint,
  requestType = 'POST',
  onUploadCancel,
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  onUploadStart,
}: UploadOptions) => {
  const { api } = useAuthStore((state) => state);
  const uploadEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const [progressDetails, setProgressDetails] = useState<{
    progress: number;
    isUploading: boolean;
  }>({
    progress: 0,
    isUploading: false,
  });
  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>(
    axios.CancelToken.source()
  );

  const stringifyValue = (value: any) => {
    if (!value) return value;

    switch (typeof value) {
      case 'object':
        // Check for custom Type

        // If Image
        const isImage = isMyCustomType<ImageWithRotation>(value);
        if (isImage) {
          const img = value as ImagePickerAsset;
          const imgFile: IFilePayload = {
            name: img.fileName || 'Untitled',
            type: img.mimeType || img.type || '',
            uri: img.uri,
          };
          console.log(imgFile, 'image');
          return imgFile;
        }

        // If Audio
        const isAudio = isMyCustomType<AssetWithDuration>(value);
        console.log(isAudio);
        if (isAudio) {
          const audio = value as AssetWithDuration;
          const audioFile: IFilePayload = {
            name: audio.file?.name || audio.name || 'Untitled',
            type: audio.mimeType || audio.file?.type || '',
            uri: audio.uri,
          };
          console.log(audioFile, 'audio');
          return audioFile;
        }

        // Else
        if (typeof value.toJSON === 'function') {
          return value.toJSON();
        }
        return JSON.stringify(value);
      case 'number':
        return value.toString();
      default:
        return value;
    }
  };

  const getFormData = (payload: Payload) => {
    const formData = new FormData();
    for (const key in payload) {
      const value = payload[key];
      if (Array.isArray(value)) {
        value.forEach((item: any, index: number) => {
          formData.append(`${key}[${index}]`, stringifyValue(item));
        });
      } else {
        formData.append(key, stringifyValue(value));
      }
    }
    return formData;
  };

  const mutation = useMutation<void, AxiosError, Payload>({
    mutationFn: async (payload) => {
      try {
        const config: AxiosRequestConfig = {
          ...api,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: api.defaults.headers['Authorization'],
          },
          method: requestType,
          url: endpoint,
          data: payload,
          cancelToken: cancelTokenSource.token,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 0)
            );
            setProgressDetails((prev) => ({
              ...prev,
              progress,
              isUploading: true,
            }));
          },
        };
        const response = await api(config);
        console.log(response.data);
        onUploadStart?.();
        return response.data;
      } catch (error) {
        console.log(error, 'try catch wala error');
        throw error;
      }
    },
    onError: (error: AxiosError) => {
      if (axios.isCancel(error)) {
        onUploadCancel?.();
        console.log('Request canceled', error.message);
      } else {
        onUploadError?.(error);
      }
    },
    onSettled: () => {
      setProgressDetails((prev) => ({ ...prev, isUploading: false }));
    },
    onSuccess: () => {
      onUploadComplete?.();
    },
  });

  const upload = async (payload: Payload) => {
    setProgressDetails({ isUploading: true, progress: 0 });
    const payloadFormData = getFormData(payload);
    // mutation.mutate(payloadFormData);
  };

  // mutation.mutate(payloadFormData);
  const cancelUpload = () => {
    cancelTokenSource.cancel('Upload Cancelled');
    mutation.reset();
  };

  return { ...mutation, progressDetails, upload, cancelUpload };
};

export default useUploadAssets;
