import { create } from 'zustand';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';

interface PlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  isLoaded: boolean;
  currentTrackIndex: number;
  tracks: ITrackDetails[];
  volume?: number;
  playbackInstance: Audio.Sound | null;
  playbackPosition: number;
  playbackDuration: number;
  playbackSpeed: number;
  isLooping: boolean;
  isQueueLooping: boolean;
  playbackError: string | null;

  loadTrack: (index: number) => Promise<void>;
  updateTracks: (tracks: ITrackDetails[]) => void;
  isNextTrackAvailable: () => boolean;
  isPrevTrackAvailable: () => boolean;
  playPause: (id?: string, play?: boolean) => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  currentTrack: () => ITrackDetails | null;
  seek: (position: number) => Promise<void>;
  setSpeed: (speed: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setLooping: (looping: boolean) => Promise<void>;
  setQueueLooping: (looping: boolean) => void;
  seekBackward: (seconds: number) => Promise<void>;
  seekForward: (seconds: number) => Promise<void>;
  toggleQueueLooping: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  isBuffering: false,
  isMuted: false,
  isLoaded: false,
  volume: 1.0,
  currentTrackIndex: 0,
  tracks: [],
  playbackInstance: null,
  playbackPosition: 0,
  playbackDuration: 0,
  playbackSpeed: 1.0,
  isLooping: false,
  isQueueLooping: false,
  playbackError: null,

  currentTrack: () => {
    const { currentTrackIndex, tracks } = get();

    return tracks[currentTrackIndex] || null;
  },

  isNextTrackAvailable: () => {
    const { currentTrackIndex, tracks, isQueueLooping } = get();

    return currentTrackIndex < tracks.length - 1 || isQueueLooping;
  },

  isPrevTrackAvailable: () => {
    const { currentTrackIndex, isQueueLooping } = get();

    return currentTrackIndex > 0 || isQueueLooping;
  },

  updateTracks: (tracks: ITrackDetails[]) => set({ tracks }),

  loadTrack: async (index: number) => {
    try {
      const { tracks, playbackInstance } = get();

      if (playbackInstance) {
        await playbackInstance.unloadAsync();
      }
      const newPlaybackInstance = new Audio.Sound();

      const { src } = tracks[index];

      if (!src) return;

      await newPlaybackInstance.loadAsync({ uri: src }, {}, false);

      newPlaybackInstance.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          set({
            playbackPosition: status.positionMillis,
            playbackDuration: status.durationMillis ?? 0,
            isPlaying: status.isPlaying,
            isBuffering: status.isBuffering,
            playbackSpeed: status.rate,
            isLooping: status.isLooping,
            isMuted: status.isMuted,
            isLoaded: status.isLoaded,
            volume: status.volume,
          });
        }
      });

      set({
        playbackInstance: newPlaybackInstance,
        currentTrackIndex: index,
        playbackError: null,
      });
    } catch (error) {
      set({ playbackError: error as string });
    }
  },

  playPause: async (id?: string, play = false) => {
    const {
      isPlaying,
      playbackInstance,
      loadTrack,
      tracks,
      currentTrack,
      playPause,
    } = get();

    if (!id && !playbackInstance) return;

    if (id && id !== currentTrack()?.id) {
      await loadTrack(tracks.findIndex((track) => track.id === id));
      await playPause(undefined, true);
      return;
    }

    if (playbackInstance) {
      if (isPlaying && !play) {
        await playbackInstance.pauseAsync();
      } else {
        await playbackInstance.playAsync();
      }
    } else if (id) {
      await loadTrack(tracks.findIndex((track) => track.id === id));
      await playPause(undefined, true);
    }
  },

  nextTrack: async () => {
    const { currentTrackIndex, tracks, loadTrack } = get();

    const nextIndex = (currentTrackIndex + 1) % tracks.length;

    await loadTrack(nextIndex);
  },

  prevTrack: async () => {
    const { currentTrackIndex, tracks, loadTrack } = get();
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    await loadTrack(prevIndex);
  },

  seek: async (position: number) => {
    const { playbackInstance } = get();

    if (playbackInstance) {
      await playbackInstance.setPositionAsync(position);
    }
  },

  setVolume: async (volume: number) => {
    const { playbackInstance } = get();

    if (playbackInstance) {
      await playbackInstance.setVolumeAsync(volume);
    }
  },

  setSpeed: async (speed: number) => {
    const { playbackInstance } = get();

    if (playbackInstance) {
      await playbackInstance.setRateAsync(speed, true);
    }
  },

  setLooping: async (looping: boolean) => {
    const { playbackInstance } = get();

    if (playbackInstance) {
      await playbackInstance.setIsLoopingAsync(looping);
    }
  },

  setQueueLooping: (looping: boolean) => set({ isQueueLooping: looping }),

  seekBackward: async (seconds: number) => {
    const { playbackInstance, playbackPosition } = get();

    const newPosition = Math.max(playbackPosition - seconds * 1000, 0);

    await playbackInstance?.setPositionAsync(newPosition);
  },

  seekForward: async (seconds: number) => {
    const { playbackInstance, playbackPosition, playbackDuration } = get();

    const newPosition = Math.min(
      playbackPosition + seconds * 1000,
      playbackDuration
    );

    await playbackInstance?.setPositionAsync(newPosition);
  },

  toggleQueueLooping: () =>
    set((state) => ({
      isQueueLooping: !state.isQueueLooping,
    })),
}));
