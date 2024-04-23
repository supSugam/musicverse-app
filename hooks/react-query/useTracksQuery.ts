import {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { TRACK_QUERY_KEY, trackKeyFactory } from '@/services/key-factory';
import { IBasePaginationParams } from '@/utils/Interfaces/IPagination';
import { GetAllTracksResponse } from '@/utils/Interfaces/ITrack';
import { cleanObject } from '@/utils/helpers/Object';
import { ReviewStatus } from '@/utils/enums/ReviewStatus';

export interface ITracksPaginationQueryParams extends IBasePaginationParams {
  creator?: boolean;
  genre?: boolean;
  tags?: boolean;
  albums?: boolean;
  likedBy?: boolean;
  playlists?: boolean;
  selectedGenre?: string;
  selectedTag?: string;
  owned?: boolean;
  liked?: boolean;
  creatorId?: string;
  public?: ReviewStatus;
}

type TracksQuery<T extends string | undefined = undefined> = {
  getAllTracks: UseQueryResult<AxiosResponse<GetAllTracksResponse, any>, Error>;
  deleteTrackById: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    string,
    unknown
  >;
  toggleLike: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    string,
    unknown
  >;
  getTrackById: UseQueryResult<AxiosResponse<any, any>, Error>;
  updateTrack: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    {
      data: FormData;
      id: string;
    },
    unknown
  >;
};

export const useTracksQuery = ({
  id,
  getAllTracksConfig,
}: {
  id?: string;
  getAllTracksConfig?: {
    params?: ITracksPaginationQueryParams;
    queryOptions?: Partial<
      UseQueryOptions<AxiosResponse<GetAllTracksResponse, any>, Error>
    >;
  };
}): TracksQuery => {
  const { api } = useAuthStore();
  const queryClient = useQueryClient();
  const getAllTracks = useQuery<AxiosResponse<GetAllTracksResponse, any>>({
    queryKey: [TRACK_QUERY_KEY, getAllTracksConfig?.params],
    queryFn: async () => {
      return await api.get('/tracks', {
        params: cleanObject(getAllTracksConfig?.params || {}),
      });
    },
    ...getAllTracksConfig?.queryOptions,
  });

  const deleteTrackById = useMutation({
    mutationKey: trackKeyFactory.deleteTrack(id),
    mutationFn: async (trackId: string) =>
      await api.delete(`/tracks/${trackId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trackKeyFactory.deleteTrack(id),
      });
      toastResponseMessage({
        content: 'Track deleted',
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

  const getTrackById = useQuery({
    queryKey: [TRACK_QUERY_KEY, id], // Include the id in the queryKey
    enabled: !!id, // Ensure the query runs only if id is provided
    queryFn: async ({ queryKey }) => {
      const [_, trackId] = queryKey; // Destructure the queryKey to get the track id
      return await api.get(`/tracks/${trackId}`);
    },
  });

  const toggleLike = useMutation({
    mutationFn: async (trackId: string) =>
      await api.post(`/tracks/toggle-like/${trackId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TRACK_QUERY_KEY],
      });
    },
    onError: (error) => {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
    },
  });

  const updateTrack = useMutation({
    mutationKey: [TRACK_QUERY_KEY],
    mutationFn: async ({ data, id }: { data: FormData; id: string }) =>
      await api.patch(`/tracks/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [TRACK_QUERY_KEY],
      });
      toastResponseMessage({
        content: 'Track Updated',
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
    getAllTracks,
    getTrackById,
    deleteTrackById,
    toggleLike,
    updateTrack,
  };
};
