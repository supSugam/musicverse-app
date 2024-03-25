import {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ALBUM_QUERY_KEY, albumKeyFactory } from '@/services/key-factory';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { AxiosResponse } from 'axios';
import { GetAllAlbumsResponse, IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import { IBasePaginationParams } from '@/utils/Interfaces/IPagination';
import { BaseResponse, SuccessResponse } from '@/utils/Interfaces/IApiResponse';
import { cleanObject } from '@/utils/helpers/Object';

export interface IAlbumsPaginationQueryParams extends IBasePaginationParams {
  creator?: boolean;
  tags?: boolean;
  savedBy?: boolean;
  tracks?: boolean;
  owned?: boolean;
  saved?: boolean;
}

type AlbumsQuery<T extends string | undefined = undefined> = {
  getAllAlbums: UseQueryResult<AxiosResponse<GetAllAlbumsResponse, any>, Error>;
  deleteAlbumById: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    string,
    unknown
  >;
  updateAlbum: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    FormData,
    unknown
  >;
  toggleSaveAlbum: UseMutationResult<
    AxiosResponse<BaseResponse, any>,
    Error,
    string,
    unknown
  >;
  createAlbum: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    FormData,
    unknown
  >;
} & (T extends string
  ? {
      getAlbumById: UseQueryResult<
        AxiosResponse<SuccessResponse<IAlbumDetails>, any>,
        Error
      >;
    }
  : {});

export const useAlbumsQuery = <T extends string | undefined = undefined>({
  id,
  getAllAlbumsConfig,
}: {
  id?: T;
  getAllAlbumsConfig?: {
    params?: IAlbumsPaginationQueryParams;
    queryOptions?: Partial<
      UseQueryOptions<AxiosResponse<GetAllAlbumsResponse, any>, Error>
    >;
  };
}): AlbumsQuery<T> => {
  // Stuffs
  const { api } = useAuthStore();
  const queryClient = useQueryClient();

  // CREATE

  const createAlbum = useMutation({
    mutationKey: albumKeyFactory.createAlbum(),
    mutationFn: async (data: FormData) => {
      return await api.post('/albums', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      console.log('hook success');
      queryClient.invalidateQueries({
        queryKey: albumKeyFactory.createAlbum(),
      });
    },
    onError: (error) => {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
    },
  });

  // READ

  const getAlbumById = useQuery({
    queryKey: [ALBUM_QUERY_KEY, id], // Include the id in the queryKey
    enabled: !!id, // Ensure the query runs only if id is provided
    queryFn: async () => {
      return await api.get(`/albums/${id}`);
    },
  });

  const getAllAlbums = useQuery<AxiosResponse<GetAllAlbumsResponse, any>>({
    queryKey: [ALBUM_QUERY_KEY, getAllAlbumsConfig?.params],
    queryFn: async () => {
      return await api.get('/albums', {
        params: cleanObject(getAllAlbumsConfig?.params || {}),
      });
    },
    ...getAllAlbumsConfig?.queryOptions,
  });

  // UPDATE

  const updateAlbum = useMutation({
    mutationKey: albumKeyFactory.updateAlbum(),
    mutationFn: async (data: FormData) => await api.patch('/albums', data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: albumKeyFactory.updateAlbum(),
      });
      toastResponseMessage({
        content: 'Album Updated',
        type: 'success',
      });
    },
    onError: (error) => {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
    },
  });

  const toggleSaveAlbum = useMutation({
    mutationKey: [ALBUM_QUERY_KEY],
    mutationFn: async (id: string) => {
      return await api.patch(`/albums/toggle-save/${id}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [ALBUM_QUERY_KEY],
      });
      toastResponseMessage({
        content: data.data.message || 'Done',
        type: 'success',
      });
    },
    onError: (error) => {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
    },
  });

  // DELETE

  const deleteAlbumById = useMutation({
    mutationKey: albumKeyFactory.deleteAlbum(id),
    mutationFn: async (id: string) => {
      return await api.delete(`/albums/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: albumKeyFactory.deleteAlbum(id),
      });
      toastResponseMessage({
        content: 'Album Deleted',
        type: 'success',
      });
    },
    onError: (error) => {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
    },
  });

  return {
    createAlbum,
    updateAlbum,
    getAllAlbums,
    deleteAlbumById,
    toggleSaveAlbum,
    getAlbumById,
  };
};
