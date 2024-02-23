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
import { TRACK_QUERY_KEY } from '@/services/key-factory';

type TracksQuery<T extends string | undefined = undefined> = {
  getAllTracks: UseQueryResult<AxiosResponse<any, any>, Error>;
} & (T extends string
  ? {
      getTrackById: UseQueryResult<AxiosResponse<any, any>, Error>;
      deleteTrack: UseMutationResult<
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

  const getAllTracks = useQuery({
    queryKey: [TRACK_QUERY_KEY],
    queryFn: async () => await api.get('/tracks'),
  });

  const deleteTrack = useMutation({
    mutationKey: [TRACK_QUERY_KEY],
    mutationFn: async (trackId: string) =>
      await api.delete(`/tracks/${trackId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TRACK_QUERY_KEY],
      });
      toastResponseMessage({
        content: 'Track deleted successfully',
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
      const [, trackId] = queryKey; // Destructure the queryKey to get the track id
      return await api.get(`/tracks/${trackId}`);
    },
  });

  return {
    getAllTracks,
    getTrackById,
    deleteTrack,
  };
};
