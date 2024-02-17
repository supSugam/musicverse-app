// import { useState } from 'react';
// import { useMutation, UseMutationResult, UseMutationOptions } from '@tanstack/react-query';
// import axios, { AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
// import { useAuthStore } from '@/services/zustand/stores/useAuthStore';

// type UploadOptions = {
//   payload: any;
//   endpoint: string;
//   reqType: 'patch' | 'post';
// };

// type UploadState = {
//   progress: number;
//   isUploading: boolean;
// };

// const useUploadAssets = (
//   options: UploadOptions,
//   config?: AxiosRequestConfig,
//   mutationOptions?: UseMutationOptions<AxiosResponse, unknown, UploadOptions>
// ): UseMutationResult<AxiosResponse, unknown, UploadOptions> => {
//   const { api } = useAuthStore((state) => state);
//   const [uploadState, setUploadState] = useState<UploadState>({
//     progress: 0,
//     isUploading: false,
//   });

//   const uploadAsset = async (formData: FormData, cancelToken: CancelToken) => {
//     const { endpoint, reqType } = options;
//     const axiosConfig: AxiosRequestConfig = {
//       ...config,
//       method: reqType,
//       url: endpoint,
//       data: formData,
//       cancelToken,
//       onUploadProgress: (progressEvent) => {
//         const progress = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
//         setUploadState({ ...uploadState, progress });
//       },
//     };

//     try {
//       const response = await api(axiosConfig);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };

//   const appendFormData = (formData: FormData, data: any, parentKey?: string) => {
//     for (const key in data) {
//       if (Object.prototype.hasOwnProperty.call(data, key)) {
//         const value = data[key];
//         const newKey = parentKey ? `${parentKey}[${key}]` : key;

//         if (value instanceof FileList) {
//           for (let i = 0; i < value.length; i++) {
//             formData.append(newKey, value[i]);
//           }
//         } else if (typeof value === 'object' && !Array.isArray(value)) {
//           appendFormData(formData, value, newKey);
//         } else {
//           formData.append(newKey, value);
//         }
//       }
//     }
//   };

//   const uploadMutation = useMutation((options) => {
//     const { payload } = options;
//     const formData = new FormData();
//     appendFormData(formData, payload);
//     return uploadAsset(formData, new axios.CancelToken(() => {}));
//   }, mutationOptions);

//   return uploadMutation;
// };

// export default useUploadAssets;
