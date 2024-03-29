import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { PROFILE_QUERY_KEY } from '@/services/key-factory';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { AxiosResponse } from 'axios';

export interface ICreateUserProfileDTO {
  name: string;
  bio?: string;
  avatar?: string;
  cover?: string;
}

export interface IUpdateUserProfileDTO extends ICreateUserProfileDTO {}

interface IProfileQuery {
  get: UseQueryResult<AxiosResponse<any, any>, Error>;
  create: UseMutationResult<AxiosResponse<any, any>, Error, FormData, unknown>;
  update: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    IUpdateUserProfileDTO,
    unknown
  >;
}

export const useProfileQuery = (): IProfileQuery => {
  const { api, currentUserProfile } = useAuthStore();
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationKey: ['createProfile'],
    mutationFn: async (data: FormData) =>
      await api.post('/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY(),
      });
      toastResponseMessage({
        content: 'Profile created successfully',
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

  const get = useQuery({
    queryKey: PROFILE_QUERY_KEY(),
    queryFn: async () => await api.get('/profile/me'),
    refetchOnWindowFocus: true,
    enabled: currentUserProfile === null,
  });

  const update = useMutation({
    mutationKey: ['updateProfile'],
    mutationFn: async (data: IUpdateUserProfileDTO) =>
      await api.patch('/profile', data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY(),
      });
      toastResponseMessage({
        content: 'Profile updated successfully',
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
    get,
    create,
    update,
  };
};
