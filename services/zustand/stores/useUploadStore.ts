//src/services/zustand/stores/useUploadStore.ts
// This store is use to persist state when user uploading track(s)/album to the server

import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { ITrack } from '../../../utils/Interfaces/ITrack';
import { IAlbum } from '../../../utils/Interfaces/IAlbum';
import { IGenre } from '../../../utils/Interfaces/IGenre';
import { USER_LIMITS } from '@/utils/constants';
import { toastResponseMessage } from '@/utils/toast';

interface IUploadStore {
  uploadType: 'single' | 'album';
  setUploadType: (type: 'single' | 'album') => void;
  track: ITrack | null;
  setTrack: (track: ITrack) => boolean;
  removeTrack: () => boolean;
  album: Partial<IAlbum> | null;
  setAlbum: (album: Partial<IAlbum>) => boolean;
  addTrackToAlbum: (track: ITrack) => void;
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
      set(() => ({ track }));
      return true;
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
      set((state) => {
        if (state.album && state.album.tracks) {
          if (state.album.tracks.length === USER_LIMITS.MAX_TRACKS_PER_ALBUM) {
            toastResponseMessage({
              content: `You can only upload a maximum of ${USER_LIMITS.MAX_TRACKS_PER_ALBUM} tracks for an album`,
              type: 'error',
            });
            return state;
          }
          if (state.album.tracks.find((t) => t.title === track.title)) {
            toastResponseMessage({
              content: `Track with title ${track.title} already exists in the album.`,
              type: 'error',
            });
            return state;
          }
          return {
            album: {
              ...state.album,
              tracks: [...state.album.tracks, track],
            },
          };
        } else {
          return {
            album: {
              ...state.album,
              tracks: [track],
            },
          };
        }
      });
    },
    removeTrackFromAlbum: (trackTitle: string) => {
      set((state) => {
        if (state.album && state.album.tracks) {
          return {
            album: {
              ...state.album,
              tracks: state.album.tracks.filter((t) => t.title !== trackTitle),
            },
          };
        } else {
          return {
            album: {
              ...state.album,
              tracks: [],
            },
          };
        }
      });
    },
  })
);
