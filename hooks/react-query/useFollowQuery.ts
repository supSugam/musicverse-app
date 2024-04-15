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
import { FEED_QUERY_KEY, profileKeyFactory } from '@/services/key-factory';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { IPlaylistDetails } from '@/utils/Interfaces/IPlaylist';
import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';

interface IFollowQueryProps {
  usernameOrId?: string | null;
}

export const useFollowQuery = ({ usernameOrId }: IFollowQueryProps = {}) => {
  const { api, isApiAuthorized } = useAuthStore();
  const queryClient = useQueryClient();

  const getFeedContent = useQuery<
    AxiosResponse<
      SuccessResponse<{
        tracks: ITrackDetails[];
        playlists: IPlaylistDetails[];
        albums: IAlbumDetails[];
      }>
    >,
    Error
  >({
    queryKey: [FEED_QUERY_KEY],
    queryFn: async () => await api.get('/paginate/feed'),
    enabled: isApiAuthorized(),
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const toggleFollow = useMutation<
    AxiosResponse<SuccessResponse<{ message: string }>>,
    Error,
    string
  >({
    mutationKey: ['follow'],
    mutationFn: async (id: string) =>
      await api.post(`/users/toggle-follow/${id}`),
    onSuccess: (_, vars) => {
      toastResponseMessage({
        type: 'info',
        content: _.data?.result?.message || '💚',
      });
      queryClient.refetchQueries({
        queryKey: profileKeyFactory.getProfileByUsername(vars),
      });
    },
    onError: (error) => {
      console.log('error', error);
      toastResponseMessage({
        type: 'error',
        content: error,
      });
    },
  });

  const getFollowers = useQuery<
    AxiosResponse<PaginationResponse<IUserWithProfile>>,
    Error
  >({
    queryKey: ['followers'],
    queryFn: async () => await api.get(`/users/followers/${usernameOrId}`),
    enabled: !!usernameOrId && isApiAuthorized(),
  });

  const getFollowing = useQuery<
    AxiosResponse<PaginationResponse<IUserWithProfile>>,
    Error
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
    getFeedContent,
  };
};
