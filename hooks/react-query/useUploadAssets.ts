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

  const stringifyValue = async (value: any) => {
    if (!value) return value;

    switch (typeof value) {
      case 'object':
        // Check for custom Type
        const isImage = isMyCustomType<ImagePickerAsset>(value);
        if (isImage) {
          const file = await imageAssetToFile(value);
          if (file) return file;
        }
        const isAudio = isMyCustomType<AssetWithDuration>(value);
        if (isAudio) {
          const file = await assetToFile(value);
          if (file) return file;
        }

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

  const getFormData = async (payload: Payload) => {
    const formData = new FormData();
    for (const key in payload) {
      const value = payload[key];
      if (Array.isArray(value)) {
        value.forEach(async (item: any, index: number) => {
          formData.append(`${key}[${index}]`, await stringifyValue(item));
        });
      } else {
        formData.append(key, await stringifyValue(value));
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
    const payloadFormData = await getFormData(payload);

    // but this results in error: Possible promise rejection TypeError: payloadFormData.vaues
    for (const val in payloadFormData.values()) {
      console.log(val);
    }
  };

  // mutation.mutate(payloadFormData);
  const cancelUpload = () => {
    cancelTokenSource.cancel('Upload Cancelled');
    mutation.reset();
  };

  return { ...mutation, progressDetails, upload, cancelUpload };
};

export default useUploadAssets;
