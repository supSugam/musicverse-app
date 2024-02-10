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
  tracks: ITrack[];
  addTrack: (track: ITrack) => void;
  removeTrack: (track: ITrack) => void;
  album: Partial<IAlbum> | null;
  setAlbum: (album: Partial<IAlbum>) => void;
}

export const useUploadStore = create<IUploadStore>(
  (set): IUploadStore => ({
    uploadType: 'single',
    setUploadType: (uploadType) => {
      set(() => ({ uploadType }));
    },
    tracks: [],
    addTrack: (track) => {
      set((state) => ({ tracks: [...state.tracks, track] }));
    },
    removeTrack: (track) => {
      set((state) => ({
        tracks: state.tracks.filter((t) => t.id !== track.id),
      }));
    },
    album: null,
    setAlbum: (album) => {
      set(() => ({ album }));
    },
  })
);
