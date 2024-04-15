import {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { profileKeyFactory } from '@/services/key-factory';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { AxiosResponse } from 'axios';
import {
  PaginationResponse,
  SuccessResponse,
} from '@/utils/Interfaces/IApiResponse';
import { IUserWithProfile, UserRole } from '@/utils/Interfaces/IUser';
import { useEffect } from 'react';
import { IBasePaginationParams } from '@/utils/Interfaces/IPagination';
import { ReviewStatus } from '@/utils/enums/ReviewStatus';

export interface ICreateUserProfileDTO {
  name: string;
  bio?: string;
  avatar?: string;
  cover?: string;
}

export interface IUsersPaginationQueryParams extends IBasePaginationParams {
  isVerified?: boolean;
  role?: UserRole;
  artistStatus?: ReviewStatus;
  sortByPopularity?: boolean;
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
  getMany: UseQueryResult<
    AxiosResponse<PaginationResponse<IUserWithProfile>, any>,
    Error
  >;
}

interface IProfileQueryProps {
  username?: string;
  getManyUsersConfig?: {
    params?: IUsersPaginationQueryParams;
    queryOptions?: Partial<
      UseQueryOptions<
        AxiosResponse<PaginationResponse<IUserWithProfile>, any>,
        Error
      >
    >;
  };
}

export const useProfileQuery = ({
  username,
  getManyUsersConfig,
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
        queryKey: profileKeyFactory.createProfile(),
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
    queryKey: profileKeyFactory.getProfile(),
    queryFn: async () => await api.get('/profile/me'),
    retry: isApiAuthorized(),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    enabled: isApiAuthorized(),
  });

  const getMany = useQuery({
    queryKey: ['getManyUsers', getManyUsersConfig?.params],
    queryFn: async () =>
      await api.get('/users', { params: getManyUsersConfig?.params }),
    retry: isApiAuthorized(),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    enabled: isApiAuthorized(),
    ...getManyUsersConfig?.queryOptions,
  });

  const update = useMutation({
    mutationKey: profileKeyFactory.updateProfile(username),
    mutationFn: async (data: IUpdateUserProfileDTO) =>
      await api.patch('/profile', data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: profileKeyFactory.updateProfile(username),
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
    queryKey: profileKeyFactory.getProfileByUsername(username),
    queryFn: async () => await api.get(`/users/${username}`),
    refetchOnWindowFocus: true,
    retry: isApiAuthorized(),
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: isApiAuthorized(),
  });

  return {
    get,
    create,
    update,
    getProfileByUsername,
    getMany,
  };
};
