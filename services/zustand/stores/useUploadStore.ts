//src/services/zustand/stores/useUploadStore.ts
// This store is use to persist state when user uploading track(s)/album to the server

import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { ITrack } from '../../../utils/Interfaces/ITrack';
import { IAlbum } from '../../../utils/Interfaces/IAlbum';
import { IGenre } from '../../../utils/Interfaces/IGenre';

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
