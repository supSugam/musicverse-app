import { useState } from 'react';
import {
  useMutation,
  UseMutationResult,
  MutationOptions,
} from '@tanstack/react-query';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  CancelTokenSource,
  Method,
} from 'axios';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';

type Payload = {
  [key: string]: any;
};

type UploadOptions = {
  payload: Payload;
  endpoint: string;
  requestType: Method;
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: () => void;
  onUploadError?: (error: any) => void;
  onUploadCancel?: () => void;
};

const useUploadAssets = ({
  payload,
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

  const getFormData = (payload: Payload) => {
    const formData = new FormData();
    for (const key in payload) {
      if (Array.isArray(payload[key])) {
        payload[key].forEach((item: any, index: number) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, payload[key]);
      }
    }
    return formData;
  };

  const mutation = useMutation<void, AxiosError, UploadOptions>({
    mutationFn: async ({ payload, endpoint, requestType }) => {
      const config: AxiosRequestConfig = {
        ...api,
        method: requestType,
        url: endpoint,
        data: payload,
        cancelToken: cancelTokenSource.token,
        onUploadProgress: (axiosProgressEvent) => {
          const progress = Math.round(
            (axiosProgressEvent.loaded * 100) / (axiosProgressEvent.total || 0)
          );
          setProgressDetails((prev) => ({
            ...prev,
            progress,
            isUploading: true,
          }));
        },
      };
      const response = await api(config);
      onUploadStart?.();
      console.log('response', response);
      return response.data;
    },
    onError: (error: any) => {
      console.log('error', error);
      if (axios.isCancel(error)) {
        onUploadCancel?.();
        console.log('Request canceled', error.message);
      } else {
        onUploadError?.(error);
        console.log('Error', error.message);
      }
    },
    onSettled: () => {
      setProgressDetails((prev) => ({ ...prev, isUploading: false }));
    },
    onSuccess: () => {
      onUploadComplete?.();
    },
  });

  const upload = async () => {
    mutation.mutate({
      payload: getFormData(payload),
      endpoint: uploadEndpoint,
      requestType,
    });
  };

  const cancelUpload = () => {
    cancelTokenSource.cancel('Upload Cancelled');
    mutation.reset();
  };

  return { ...mutation, progressDetails, upload, cancelUpload };
};

export default useUploadAssets;
