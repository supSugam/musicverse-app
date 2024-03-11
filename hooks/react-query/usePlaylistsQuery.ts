import {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IBasePaginationParams } from '@/utils/Interfaces/IPagination';
import { cleanObject } from '@/utils/helpers/Object';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { PLAYLIST_QUERY_KEY, playlistKeyFactory } from '@/services/key-factory';
import { toastResponseMessage } from '@/utils/toast';
import { GetAllPlaylistsResponse } from '@/utils/Interfaces/IPlaylist';

export interface IPlaylistsPaginationQueryParams extends IBasePaginationParams {
  creator?: boolean;
  tags?: boolean;
  tracks?: boolean;
  savedBy?: boolean;
  collaborators?: boolean;
}

type PlaylistsQuery<T extends string | undefined = undefined> = {
  getAllPlaylists: UseQueryResult<
    AxiosResponse<GetAllPlaylistsResponse, any>,
    Error
  >;
  createPlaylist: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    any,
    unknown
  >;
  updatePlaylist: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    any,
    unknown
  >;
} & (T extends string
  ? {
      getPlaylistById: UseQueryResult<AxiosResponse<any, any>, Error>;
      deletePlaylistById: UseMutationResult<
        AxiosResponse<any, any>,
        Error,
        string,
        unknown
      >;
      toggleSavePlaylist: UseMutationResult<
        AxiosResponse<any, any>,
        Error,
        string,
        unknown
      >;
    }
  : {});

export const usePlaylistsQuery = <T extends string | undefined = undefined>({
  id,
  getAllPlaylistsConfig,
}: {
  id?: T;
  getAllPlaylistsConfig?: {
    params?: IPlaylistsPaginationQueryParams;
    queryOptions?: Partial<
      UseQueryOptions<AxiosResponse<GetAllPlaylistsResponse, any>, Error>
    >;
  };
}): PlaylistsQuery<T> => {
  const { api } = useAuthStore();
  const queryClient = useQueryClient();
  const getAllPlaylists = useQuery<AxiosResponse<GetAllPlaylistsResponse, any>>(
    {
      queryKey: [PLAYLIST_QUERY_KEY, getAllPlaylistsConfig?.params],
      queryFn: async () => {
        return await api.get('/playlists', {
          params: cleanObject(getAllPlaylistsConfig?.params || {}),
        });
      },
      ...getAllPlaylistsConfig?.queryOptions,
    }
  );

  const createPlaylist = useMutation({
    mutationKey: playlistKeyFactory.createPlaylist(),
    mutationFn: async (playlist: any) => await api.post('/playlists', playlist),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PLAYLIST_QUERY_KEY],
      });
      toastResponseMessage({
        content: 'Playlist created',
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

  const updatePlaylist = useMutation({
    mutationKey: playlistKeyFactory.updatePlaylist(id),
    mutationFn: async (playlist: any) =>
      await api.patch(`/playlists/${id}`, playlist),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: playlistKeyFactory.updatePlaylist(id),
      });
      toastResponseMessage({
        content: 'Playlist updated',
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

  const deletePlaylistById = useMutation({
    mutationKey: playlistKeyFactory.deletePlaylist(id),
    mutationFn: async (playlistId: string) =>
      await api.delete(`/playlists/${playlistId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: playlistKeyFactory.deletePlaylist(id),
      });
      toastResponseMessage({
        content: 'Playlist deleted',
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

  const getPlaylistById = useQuery({
    queryKey: [PLAYLIST_QUERY_KEY, id], // Include the id in the queryKey
    enabled: !!id, // Ensure the query runs only if id is provided
    queryFn: async () => {
      return await api.get(`/playlists/${id}`);
    },
  });

  const toggleSavePlaylist = useMutation({
    mutationFn: async (playlistId: string) =>
      await api.post(`/playlists/toggle-save/${playlistId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PLAYLIST_QUERY_KEY],
      });
    },
    onError: (error) => {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
    },
  });

  const addTracksToPlaylist = useMutation({
    mutationFn: async ({
      playlistId,
      tracks,
    }: {
      playlistId: string;
      tracks: string[];
    }) => await api.post(`/playlists/add-tracks/${playlistId}`, { tracks }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PLAYLIST_QUERY_KEY],
      });
    },
    onError: (error) => {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
    },
  });

  const addTrackToPlaylists = useMutation({
    mutationFn: async ({
      trackId,
      playlists,
    }: {
      trackId: string;
      playlists: string[];
    }) => await api.post(`/playlists/add-track/${trackId}`, { playlists }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PLAYLIST_QUERY_KEY],
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
    getAllPlaylists,
    getPlaylistById,
    deletePlaylistById,
    toggleSavePlaylist,
    addTracksToPlaylist,
    addTrackToPlaylists,
    createPlaylist,
    updatePlaylist,
  };
};
