import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { PROFILE_QUERY_KEY, profileKeyFactory } from '@/services/key-factory';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { Axios, AxiosResponse } from 'axios';
import { SuccessResponse } from '@/utils/Interfaces/IApiResponse';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';

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
  getProfileByUsername: UseQueryResult<
    AxiosResponse<SuccessResponse<IUserWithProfile>, Error>,
    Error
  >;
}

interface IProfileQueryProps {
  username?: string;
}

export const useProfileQuery = ({
  username,
}: IProfileQueryProps = {}): IProfileQuery => {
  const {
    api,
    registerFcmToken,
    setCurrentUser,
    currentUserOnHold,
    setCurrentUserOnHold,
    isApiAuthorized,
  } = useAuthStore();
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
      setCurrentUser(currentUserOnHold);
      setCurrentUserOnHold(null);
      registerFcmToken();

      toastResponseMessage({
        content: 'Welcome to MusicVerse! ',
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
    retry: isApiAuthorized(),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    enabled: isApiAuthorized(),
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

  const getProfileByUsername = useQuery({
    queryKey: [username, 'profile'],
    queryFn: async () => await api.get(`/users/${username}`),
    refetchOnWindowFocus: true,
    enabled: !!username && isApiAuthorized(),
    retry: isApiAuthorized(),
  });

  return {
    get,
    create,
    update,
    getProfileByUsername,
  };
};
