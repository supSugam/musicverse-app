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
import {
  GetAllPlaylistsResponse,
  IInvitationToken,
  IPlaylistDetails,
} from '@/utils/Interfaces/IPlaylist';
import { BaseResponse, SuccessResponse } from '@/utils/Interfaces/IApiResponse';

export interface IPlaylistsPaginationQueryParams extends IBasePaginationParams {
  creator?: boolean;
  tags?: boolean;
  tracks?: boolean;
  savedBy?: boolean;
  collaborators?: boolean;
  containsTrack?: string;
  owned?: boolean;
  collaborated?: boolean;
  saved?: boolean;
}

interface TrackToPlaylist {
  trackId: string;
  playlists: string[];
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
  addTrackToPlaylists: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    TrackToPlaylist,
    unknown
  >;
  removeTrackFromPlaylists: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    TrackToPlaylist,
    unknown
  >;
  removeTracksFromPlaylist: UseMutationResult<
    AxiosResponse<BaseResponse, any>,
    Error,
    { playlistId: string; tracks: string[] },
    unknown
  >;
  deletePlaylistById: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    string,
    unknown
  >;
  generatePlaylistInvitation: UseMutationResult<
    AxiosResponse<SuccessResponse<IInvitationToken>, any>,
    Error,
    string,
    unknown
  >;
} & (T extends string
  ? {
      getPlaylistById: UseQueryResult<
        AxiosResponse<SuccessResponse<IPlaylistDetails>, any>,
        Error
      >;
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
      updatePlaylist: UseMutationResult<
        AxiosResponse<any, any>,
        Error,
        FormData,
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
    mutationFn: async (playlist: FormData) =>
      await api.post('/playlists', playlist, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PLAYLIST_QUERY_KEY],
      });
      toastResponseMessage({
        content: 'Playlist Created',
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
    mutationFn: async (playlist: FormData) =>
      await api.patch(`/playlists/${id}`, playlist, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: playlistKeyFactory.updatePlaylist(id),
      });
      toastResponseMessage({
        content: 'Playlist Updated',
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
        content: 'Playlist Deleted',
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
      return await api.get(`/playlists/${id}?tracks=true`);
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

  const addTrackToPlaylists = useMutation({
    mutationFn: async ({ trackId, playlists }: TrackToPlaylist) =>
      await api.post(`/playlists/add-track/${trackId}`, { playlists }),
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

  const removeTrackFromPlaylists = useMutation({
    mutationFn: async ({ trackId, playlists }: TrackToPlaylist) =>
      await api.post(`/playlists/remove-track/${trackId}`, { playlists }),
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

  const removeTracksFromPlaylist = useMutation({
    mutationFn: async ({
      playlistId,
      tracks,
    }: {
      playlistId: string;
      tracks: string[];
    }) => await api.post(`/playlists/remove-tracks/${playlistId}`, { tracks }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PLAYLIST_QUERY_KEY, playlistKeyFactory.deletePlaylist(id)],
      });
    },
    onError: (error) => {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
    },
  });

  const generatePlaylistInvitation = useMutation<
    AxiosResponse<SuccessResponse<IInvitationToken>, any>,
    Error,
    string
  >({
    mutationFn: async (playlistId: string) =>
      await api.post(`/playlists/invitation/${playlistId}`),
    onSuccess: () => {
      toastResponseMessage({
        content: 'Invitation Link (7 Days) Copied to Clipboard',
        type: 'success',
      });
      toastResponseMessage({
        content: 'This will only work after custom domain is set up',
        type: 'info',
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
    addTrackToPlaylists,
    createPlaylist,
    updatePlaylist,
    removeTrackFromPlaylists,
    removeTracksFromPlaylist,
    generatePlaylistInvitation,
  };
};
