//src/services/zustand/stores/useUploadStore.ts
// This store is use to persist state when user uploading track(s)/album to the server

import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { ITrack } from '../../../utils/Interfaces/ITrack';
import { IAlbum } from '../../../utils/Interfaces/IAlbum';
import { IGenre } from '../../../utils/Interfaces/IGenre';
import { USER_LIMITS } from '@/utils/constants';
import { toastResponseMessage } from '@/utils/toast';
import { ISimpleResponse } from '@/utils/Interfaces/ISimpleResponse';

interface IUploadStore {
  uploadType: 'single' | 'album';
  setUploadType: (type: 'single' | 'album') => void;
  track: ITrack | null;
  setTrack: (track: ITrack) => ISimpleResponse;
  removeTrack: () => boolean;
  album: Partial<IAlbum> | null;
  setAlbum: (album: Partial<IAlbum>) => boolean;
  addTrackToAlbum: (track: ITrack) => ISimpleResponse;
  removeTrackFromAlbum: (trackId: string) => void;
}

export const useUploadStore = create<IUploadStore>(
  (set): IUploadStore => ({
    uploadType: 'single',
    setUploadType: (uploadType) => {
      set(() => ({ uploadType }));
    },
    track: null,
    setTrack: (track) => {
      const response = {
        content: 'Track added successfully',
        type: 'success',
      } as ISimpleResponse;
      set((state) => {
        if (state.track) {
          response.content = 'You can only upload one track at a time';
          response.type = 'error';
          return state;
        } else {
          return { track };
        }
      });
      return response;
    },
    removeTrack: () => {
      set(() => ({ track: null }));
      return true;
    },

    album: null,
    setAlbum: (album) => {
      set(() => ({ album }));
      return true;
    },
    addTrackToAlbum: (track: ITrack) => {
      let response = {
        content: 'Track added successfully',
        type: 'success',
      } as ISimpleResponse;

      set((state) => {
        if (!state.album) {
          return { album: { tracks: [track] } };
        }

        const { album } = state;
        const { tracks } = album;
        if (tracks && tracks.length === USER_LIMITS.MAX_TRACKS_PER_ALBUM) {
          response = {
            content: `You can only upload a maximum of ${USER_LIMITS.MAX_TRACKS_PER_ALBUM} tracks for an album`,
            type: 'error',
          };
          return state;
        }

        if (
          tracks &&
          tracks.some(
            (t) => t.title.toLowerCase() === track.title.toLowerCase()
          )
        ) {
          response = {
            content: `Track with title ${track.title} already exists in the album.`,
            type: 'error',
          };
          return state;
        }

        return {
          album: { ...album, tracks: [...(tracks ? tracks : []), track] },
        };
      });

      return response;
    },

    removeTrackFromAlbum: (trackTitle: string) => {
      set((state) => {
        if (!state.album) {
          return state;
        }

        const { album } = state;
        const { tracks } = album;
        if (tracks) {
          const newTracks = tracks.filter(
            (track) => track.title.toLowerCase() !== trackTitle.toLowerCase()
          );
          return { album: { ...album, tracks: newTracks } };
        }
        return state;
      });
    },
  })
);
