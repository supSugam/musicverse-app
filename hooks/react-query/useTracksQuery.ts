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

export interface ITracksPaginationQueryParams extends IBasePaginationParams {
  creator?: boolean;
  genre?: boolean;
  tags?: boolean;
  albums?: boolean;
  likedBy?: boolean;
  playlists?: boolean;
}

type TracksQuery<T extends string | undefined = undefined> = {
  getAllTracks: UseQueryResult<AxiosResponse<GetAllTracksResponse, any>, Error>;
} & (T extends string
  ? {
      getTrackById: UseQueryResult<AxiosResponse<any, any>, Error>;
      deleteTrackById: UseMutationResult<
        AxiosResponse<any, any>,
        Error,
        string, // Ensure the mutation function receives a string (track id)
        unknown
      >;
    }
  : {});

export const useTracksQuery = <T extends string | undefined = undefined>(
  id?: T
): TracksQuery<T> => {
  const { api } = useAuthStore();
  const queryClient = useQueryClient();

  const getAllTracks = useQuery<AxiosResponse<GetAllTracksResponse, any>>({
    queryKey: [TRACK_QUERY_KEY],
    queryFn: async (params) => await api.get('/tracks', { params }),
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

  return {
    getAllTracks,
    getTrackById,
    deleteTrackById,
  };
};
