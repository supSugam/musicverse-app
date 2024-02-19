import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  CancelTokenSource,
} from 'axios';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { ImagePickerAsset } from 'expo-image-picker';
import { assetToFile, imageAssetToFile } from '@/utils/helpers/file';
import { AssetWithDuration } from '../useAssetsPicker';

type Payload = {
  [key: string]: any;
  uploadKey: string;
};

type UploadOptions = {
  endpoint: string;
  requestType: 'POST' | 'PATCH';
  multiple?: boolean;
  payload?: Payload | Payload[] | null;
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: () => void;
  onUploadError?: (error: any) => void;
  onUploadCancel?: () => void;
};

type ProgressDetails = Record<
  string,
  {
    progress: number;
    isUploading: boolean;
  }
>;

const useUploadAssets = ({
  endpoint,
  requestType = 'POST',
  multiple = false,
  payload,
  onUploadCancel,
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  onUploadStart,
}: UploadOptions) => {
  if (!payload) throw new Error('Payload is required');
  if (multiple && !Array.isArray(payload))
    throw new Error('Payload should be an array');
  if (!multiple && Array.isArray(payload))
    throw new Error('Payload should be an object');

  const { api } = useAuthStore((state) => state);

  const InitialProgressDetails = useMemo(() => {
    if (multiple) {
      const progressDetails: ProgressDetails = {};
      payload?.forEach((item: any, index: number) => {
        progressDetails[index] = {
          progress: 0,
          isUploading: false,
        };
      });
      return progressDetails;
    } else {
      return {
        single: {
          progress: 0,
          isUploading: false,
        },
      };
    }
  }, [multiple, payload]);

  const [progressDetails, setProgressDetails] = useState<ProgressDetails>(
    InitialProgressDetails
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
      if (key === 'uploadKey') continue; // make constant for uploadKey
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

  const mutation = useMutation<void, AxiosError, any>({
    mutationFn: async ({
      payload,
      uploadKey,
    }: {
      payload: FormData;
      uploadKey: string;
    }) => {
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
              [uploadKey]: { progress, isUploading: true },
            }));
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
      if (axios.isCancel(error)) {
        onUploadCancel?.();
        console.log('Request canceled', error.message);
      } else {
        onUploadError?.(error);
      }
    },
    onSettled: () => {},
    onSuccess: () => {
      onUploadComplete?.();
    },
  });

  const uploadTracks = async () => {
    // payload example [{file: 'file'}, {file: 'file'}]
    switch (multiple) {
      case true:
        if (!Array.isArray(payload))
          throw new Error('Payload should be an array');
        payload.forEach(async (item: any, index: number) => {
          const payloadFormData = getFormData(item);
          await mutation.mutateAsync(payloadFormData);
        });
        break;

      case false:
        if (Array.isArray(payload))
          throw new Error('Payload should be an object');
        const payloadFormData = getFormData(payload);
        await mutation.mutateAsync(payloadFormData);
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
