import {
  UseMutationResult,
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

export interface ITracksPaginationQueryParams extends IBasePaginationParams {
  creator?: boolean;
  genre?: boolean;
  tags?: boolean;
  albums?: boolean;
  likedBy?: boolean;
  playlists?: boolean;
  selectedGenre?: string;
  selectedTag?: string;
}

type TracksQuery<T extends string | undefined = undefined> = {
  getAllTracks: UseQueryResult<AxiosResponse<GetAllTracksResponse, any>, Error>;
  params?: ITracksPaginationQueryParams;
} & (T extends string
  ? {
      getTrackById: UseQueryResult<AxiosResponse<any, any>, Error>;
      deleteTrackById: UseMutationResult<
        AxiosResponse<any, any>,
        Error,
        string, // Ensure the mutation function receives a string (track id)
        unknown
      >;
      toggleLike: UseMutationResult<
        AxiosResponse<any, any>,
        Error,
        string, // Ensure the mutation function receives a string (track id)
        unknown
      >;
    }
  : {});

export const useTracksQuery = <T extends string | undefined = undefined>({
  id,
  params,
}: {
  id?: T;
  params?: ITracksPaginationQueryParams;
}): TracksQuery<T> => {
  const { api } = useAuthStore();
  const queryClient = useQueryClient();
  const getAllTracks = useQuery<AxiosResponse<GetAllTracksResponse, any>>({
    queryKey: [TRACK_QUERY_KEY, params],
    queryFn: async () => {
      console.log(params?.selectedGenre, 'refetch');
      return await api.get('/tracks', { params: cleanObject(params || {}) });
    },
    enabled: !!params,
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
        queryKey: trackKeyFactory.toggleLike(id),
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
  };
};
