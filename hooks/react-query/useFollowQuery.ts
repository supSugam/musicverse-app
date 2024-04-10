import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { AxiosResponse } from 'axios';
import {
  BaseResponse,
  PaginationResponse,
  SuccessResponse,
} from '@/utils/Interfaces/IApiResponse';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';

interface IFollowQueryProps {
  usernameOrId?: string | null;
}

export const useFollowQuery = ({ usernameOrId }: IFollowQueryProps = {}) => {
  const { api, isApiAuthorized } = useAuthStore();
  const queryClient = useQueryClient();

  const toggleFollow = useMutation<AxiosResponse<BaseResponse>, Error, string>({
    mutationKey: ['follow'],
    mutationFn: async (id: string) =>
      await api.post(`/users/toggle-follow/${id}`),
    onSuccess: (data, vars) => {
      console.log(vars, 'vars');
      console.log(data);
    },
    onError: (error) => {
      toastResponseMessage({
        type: 'error',
        content: error,
      });
    },
  });

  const getFollowers = useQuery<
    AxiosResponse<PaginationResponse<IUserWithProfile>>,
    Error,
    string
  >({
    queryKey: ['followers'],
    queryFn: async () => await api.get(`/users/followers/${usernameOrId}`),
    enabled: !!usernameOrId && isApiAuthorized(),
  });

  const getFollowing = useQuery<
    AxiosResponse<PaginationResponse<IUserWithProfile>>,
    Error,
    string
  >({
    queryKey: ['following'],
    queryFn: async () => await api.get(`/users/following/${usernameOrId}`),
    enabled: !!usernameOrId && isApiAuthorized(),
  });

  const getFollowCounts = useQuery<
    AxiosResponse<
      SuccessResponse<{ followersCount: number; followingCount: number }>
    >,
    Error,
    string
  >({
    queryKey: ['follow-counts'],
    queryFn: async () => await api.get(`/users/follow-counts/${usernameOrId}`),
    enabled: !!usernameOrId && isApiAuthorized(),
  });

  return {
    toggleFollow,
    getFollowers,
    getFollowing,
    getFollowCounts,
  };
};
