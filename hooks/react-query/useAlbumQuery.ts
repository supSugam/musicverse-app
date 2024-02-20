import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { albumKeyFactory } from '@/services/key-factory';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { AxiosResponse } from 'axios';
import {
  ICreateAlbumPayload,
  IUpdateAlbumPayload,
} from '@/utils/Interfaces/IAlbum';

interface IProfileQuery {
  // get: UseQueryResult<AxiosResponse<any, any>, Error>;
  create: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    ICreateAlbumPayload,
    unknown
  >;
  update: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    IUpdateAlbumPayload,
    unknown
  >;
}

export const useAlbumQuery = (): IProfileQuery => {
  const { api } = useAuthStore((state) => state);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationKey: albumKeyFactory.createAlbum(),
    mutationFn: async (data: ICreateAlbumPayload) =>
      await api.post('/albums', data),
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

  // const get = useQuery({
  //   queryKey: PROFILE_QUERY_KEY(),
  //   queryFn: async () => await api.get('/profile/me'),
  //   refetchOnWindowFocus: true,
  //   enabled: currentUserProfile === null,
  // });

  const update = useMutation({
    mutationKey: albumKeyFactory.updateAlbum(''),
    mutationFn: async (data: IUpdateAlbumPayload) =>
      await api.patch('/albums', data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: albumKeyFactory.updateAlbum(''), // TODO: add album id
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

  return {
    create,
    update,
  };
};
