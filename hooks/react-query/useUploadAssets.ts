import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { UploadStatus } from '@/utils/enums/IUploadStatus';
import { TRACK_QUERY_KEY } from '@/services/key-factory';

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
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: any) => void;
  onUploadCancel?: () => void;
};

type ProgressDetails = Record<
  string,
  {
    progress: number;
    uploadStatus: UploadStatus;
  }
>;

const useUploadAssets = ({
  endpoint,
  requestType = 'POST',
  multiple = false,
  payload,
  onUploadCancel,
  onUploadSuccess,
  onUploadError,
  onUploadProgress,
  onUploadStart,
}: UploadOptions) => {
  const { api } = useAuthStore();

  const resetUploadStatus = (uploadStatus: UploadStatus) => {
    setProgressDetails((prev) => {
      const newProgressDetails = { ...prev };
      for (const key in newProgressDetails) {
        newProgressDetails[key] = { progress: 0, uploadStatus };
      }
      return newProgressDetails;
    });
  };

  const initialProgressDetails = useMemo(() => {
    const progressDetails: ProgressDetails = {};
    if (!payload) return progressDetails;
    payload?.forEach((item: Payload, index: number) => {
      progressDetails[item.uploadKey] = {
        progress: 0,
        uploadStatus: UploadStatus.QUEUED,
      };
    });
    return progressDetails;
  }, [multiple, payload]);

  const [progressDetails, setProgressDetails] = useState<ProgressDetails>(
    initialProgressDetails
  );
  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>(
    axios.CancelToken.source()
  );

  const queryClient = useQueryClient();

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
          // Handling arrays
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
              [uploadKey]: { progress, uploadStatus: UploadStatus.UPLOADING },
            }));
          },
        };
        const response = await api(config);
        onUploadStart?.();
        return response.data;
      } catch (error) {
        setProgressDetails((prev) => ({
          ...prev,
          [uploadKey]: { progress: 0, uploadStatus: UploadStatus.FAILED },
        }));
        throw error;
      }
    },
    onError: (error: AxiosError) => {
      resetUploadStatus(UploadStatus.FAILED);
      if (axios.isCancel(error)) {
        onUploadCancel?.();
      } else {
        onUploadError?.(error);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [TRACK_QUERY_KEY],
      });
      resetUploadStatus(UploadStatus.SUCCESS);
      onUploadSuccess?.(data);
    },
  });

  const uploadAssets = async (payloadData?: Payload[]) => {
    const payloadToUpload = payloadData || payload || [];
    if (payloadToUpload.length === 0) {
      toastResponseMessage({
        content: 'No files to upload',
        type: 'error',
      });
      return;
    }

    for (const item of payloadToUpload) {
      const payloadFormData = getFormData(item);
      await mutation.mutateAsync({
        payload: payloadFormData,
        uploadKey: item.uploadKey,
      });
    }
  };

  // mutation.mutate(payloadFormData);
  const cancelUpload = () => {
    setProgressDetails(initialProgressDetails);
    cancelTokenSource.cancel('Upload Cancelled');
    setCancelTokenSource(axios.CancelToken.source());
    mutation.reset();
  };

  return {
    progressDetails,
    uploadAssets,
    cancelUpload,
  };
};

export default useUploadAssets;
