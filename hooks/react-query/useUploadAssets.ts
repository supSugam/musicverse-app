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
import { IFilePayload } from '@/utils/Interfaces/IFilePayload';
import { ImageWithRotation } from '../useImagePicker';
import { set } from 'react-hook-form';

type Payload = {
  [key: string]: any;
};

type UploadOptions = {
  endpoint: string;
  requestType: 'POST' | 'PATCH';
  multiple?: boolean;
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: () => void;
  onUploadError?: (error: any) => void;
  onUploadCancel?: () => void;
};

// uploadId: T extends true ? string : string | undefined;

type ProgressDetails = {
  progress: number;
  isUploading: boolean;
}[];

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

  const initialProgressDetails: ProgressDetails = [
    {
      // uploadId: multiple ? '' : undefined,
      progress: 0,
      isUploading: false,
    },
  ];
  const [progressDetails, setProgressDetails] = useState<ProgressDetails>(
    initialProgressDetails
  );
  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>(
    axios.CancelToken.source()
  );

  const stringifyValue = (value: any) => {
    if (!value) return value;

    switch (typeof value) {
      case 'object':
        if (value.type === 'image') {
          const img = value as ImagePickerAsset;
          const imgFile = imageAssetToFile(img);
          return imgFile;
        }

        // If Audio
        if (value.type === 'audio') {
          const audio = value as AssetWithDuration;
          const audioFile = assetToFile(audio);
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
      if (key === 'uploadId') continue;
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
    mutationFn: async ({ payload, index }) => {
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
            setProgressDetails((prev) => {
              const updatedProgressDetails = [...prev];
              updatedProgressDetails[index] = { progress, isUploading: true };
              return updatedProgressDetails;
            });
          },
          maxRate: 1,
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
      setProgressDetails((prev) => {
        return prev.map((item) => ({ ...item, isUploading: false }));
      });
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
      setProgressDetails((prev) => {
        return prev.map((item) => ({ ...item, isUploading: false }));
      });
    },
  });

  const uploadTracks = async (payload: Payload, multiple = false) => {
    setProgressDetails((prev) => [{ ...prev, progress: 0, isUploading: true }]);
    switch (multiple) {
      case true:
        if (!Array.isArray(payload))
          throw new Error('Payload should be an array');
        payload.forEach((item: any, index: number) => {
          const payloadFormData = getFormData(item);
          mutation.mutate({ payloadFormData, index });
        });
        break;

      case false:
        if (Array.isArray(payload))
          throw new Error('Payload should be an object');
        const payloadFormData = getFormData(payload);
        mutation.mutate({ payloadFormData, index: 0 });
        break;
    }
  };

  // mutation.mutate(payloadFormData);
  const cancelUpload = () => {
    cancelTokenSource.cancel('Upload Cancelled');
    setCancelTokenSource(axios.CancelToken.source());
    mutation.reset();
  };

  return {
    progressDetails,
    uploadTracks,
    cancelUpload,
  };
};

export default useUploadAssets;
