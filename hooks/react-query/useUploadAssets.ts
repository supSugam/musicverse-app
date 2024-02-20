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
import { toastResponseMessage } from '@/utils/toast';

type Payload = {
  [key: string]: any;
  uploadKey: string;
};

type UploadOptions = {
  endpoint: string;
  requestType: 'POST' | 'PATCH';
  multiple?: boolean;
  payload?: Payload[] | null;
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
  const { api } = useAuthStore((state) => state);

  const InitialProgressDetails = useMemo(() => {
    const progressDetails: ProgressDetails = {};
    if (!payload) return progressDetails;
    payload?.forEach((item: Payload, index: number) => {
      progressDetails[item.uploadKey] = {
        progress: 0,
        isUploading: false,
      };
    });
    return progressDetails;
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
        };
        const response = await api(config);
        onUploadStart?.();
        console.log(response.data);
        return response.data;
      } catch (error) {
        setProgressDetails((prev) => ({
          ...prev,
          [uploadKey]: { progress: 0, isUploading: false },
        }));
        throw error;
      }
    },
    onError: (error: AxiosError) => {
      setProgressDetails(InitialProgressDetails);
      if (axios.isCancel(error)) {
        onUploadCancel?.();
      } else {
        onUploadError?.(error);
      }
    },
    onSettled: () => {},
    onSuccess: () => {
      setProgressDetails(InitialProgressDetails);
      onUploadComplete?.();
    },
  });

  const uploadTracks = async (payloadData?: Payload[]) => {
    // payload example [{file: 'file'}, {file: 'file'}]

    if (!payload && !payloadData) {
      toastResponseMessage({
        content: 'No files to upload',
        type: 'error',
      });
      return;
    }

    (payload || payloadData || []).forEach(async (item: Payload) => {
      const payloadFormData = getFormData(item);
      await mutation.mutateAsync({
        payload: payloadFormData,
        uploadKey: item.uploadKey,
      });
    });
  };

  // mutation.mutate(payloadFormData);
  const cancelUpload = () => {
    setProgressDetails(InitialProgressDetails);
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
