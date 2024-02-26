import { create } from 'zustand';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';

const InitialState = {
  isPlaying: false,
  isBuffering: false,
  isMuted: false,
  isLoaded: false,
  currentTrackIndex: 0,
  tracks: [],
  playbackInstance: null,
  playbackPosition: 0,
  playbackDuration: 0,
  playbackSpeed: 1,
  isLoopingSingle: false,
  isLoopingQueue: false,
  playUntilLastTrack: true,
  stopAfterCurrentTrack: false,
  playbackError: null,
};

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
  isLoopingSingle: boolean;
  isLoopingQueue: boolean;
  playUntilLastTrack: boolean;
  stopAfterCurrentTrack: boolean;
  playbackError: string | null;

  loadTrack: (index: number) => Promise<void>;
  updateTracks: (tracks: ITrackDetails[]) => void;
  isNextTrackAvailable: () => boolean;
  isPrevTrackAvailable: () => boolean;
  playPause: (id?: string, play?: boolean) => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  currentTrack: ITrackDetails | null;
  seek: (position: number) => Promise<void>;
  setSpeed: (speed: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  enableSingleLooping: () => Promise<void>;
  disableSingleLooping: () => Promise<void>;
  enableQueueLooping: () => Promise<void>;
  enablePlayUntilLastTrack: () => Promise<void>;
  enableStopAfterCurrentTrack: () => Promise<void>;

  seekBackward: (seconds: number) => Promise<void>;
  seekForward: (seconds: number) => Promise<void>;
  toggleLoopStates: () => Promise<void>;

  resetPlayer: () => void;
}
// TODO : Sleep Timer

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...InitialState,


  currentTrack:(get().tracks[get().currentTrackIndex])||null,

  isNextTrackAvailable: () => {
    const { currentTrackIndex, tracks, isLoopingQueue } = get();

    return currentTrackIndex < tracks.length - 1 || isLoopingQueue;
  },

  isPrevTrackAvailable: () => {
    const { currentTrackIndex, isLoopingQueue } = get();

    return currentTrackIndex > 0 || isLoopingQueue;
  },

  updateTracks: (tracks: ITrackDetails[]) => {
    set({ tracks });
    const { playbackInstance,currentTrack } = get();
    tracks.forEach((track) => {
      if (track.id === currentTrack?.id) {
        playbackInstance?.loadAsync({ uri: track.src }, {}, false);
      }
    });
  },

  loadTrack: async (index: number) => {
    try {
      const {
        tracks,
        playbackInstance,
        isLoopingSingle,
        isLoopingQueue,
        playUntilLastTrack,
        stopAfterCurrentTrack,
        nextTrack,
      } = get();

      if (playbackInstance) {
        await playbackInstance.unloadAsync();
      }
      const newPlaybackInstance = new Audio.Sound();

      const { src } = tracks[index];

      if (!src) return;

      await newPlaybackInstance.loadAsync({ uri: src }, {}, false);

      newPlaybackInstance.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded) {
          set({
            playbackPosition: status.positionMillis,
            playbackDuration: status.durationMillis ?? 0,
            isPlaying: status.isPlaying,
            isBuffering: status.isBuffering,
            playbackSpeed: status.rate,
            isLoopingSingle: status.isLooping,
            isMuted: status.isMuted,
            isLoaded: status.isLoaded,
            volume: status.volume,
          });

          if (status.didJustFinish) {
            console.log('didJustFinish');
            console.log('isLoopingSingle', isLoopingSingle);
            console.log('stopAfterCurrentTrack', stopAfterCurrentTrack);
            console.log('playUntilLastTrack', playUntilLastTrack);
            console.log('isLoopingQueue', isLoopingQueue);

            if (isLoopingSingle || stopAfterCurrentTrack) {
              return;
            }
            if (isLoopingQueue) {
              await nextTrack();
              return;
            }
            if (playUntilLastTrack && index === tracks.length - 1) {
              await nextTrack();
              return;
            }
          }
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
      playPause,
      currentTrack
    } = get();

    if (!id && !playbackInstance) return;

    if (id && id !== currentTrack?.id) {
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
    const {
      currentTrackIndex,
      tracks,
      loadTrack,
      isNextTrackAvailable,
      playPause,
    } = get();
    if (!isNextTrackAvailable()) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    await loadTrack(nextIndex);
    await playPause();
  },

  prevTrack: async () => {
    const {
      currentTrackIndex,
      tracks,
      loadTrack,
      isPrevTrackAvailable,
      playPause,
    } = get();
    if (!isPrevTrackAvailable()) return;
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    await loadTrack(prevIndex);
    await playPause();
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

  // setLooping: async () => {
  //   const { playbackInstance } = get();

  //   if (playbackInstance) {
  //     await playbackInstance.setIsLoopingAsync(
  //   }
  // },

  enableSingleLooping: async () => {
    const { playbackInstance } = get();

    set({
      isLoopingSingle: true,
      isLoopingQueue: false,
      playUntilLastTrack: false,
      stopAfterCurrentTrack: false,
    });

    if (playbackInstance) {
      await playbackInstance.setIsLoopingAsync(true);
    }
  },

  disableSingleLooping: async () => {
    const { playbackInstance } = get();
    set({ isLoopingSingle: false });
    if (playbackInstance) {
      await playbackInstance.setIsLoopingAsync(false);
    }
  },

  enableQueueLooping: async () => {
    const { disableSingleLooping } = get();
    await disableSingleLooping();
    set({
      isLoopingQueue: true,
      playUntilLastTrack: false,
      stopAfterCurrentTrack: false,
    });
  },

  enableStopAfterCurrentTrack: async () => {
    const { disableSingleLooping } = get();
    await disableSingleLooping();
    set({
      stopAfterCurrentTrack: true,
      isLoopingSingle: false,
      playUntilLastTrack: false,
      isLoopingQueue: false,
    });
  },

  enablePlayUntilLastTrack: async () => {
    const { disableSingleLooping } = get();
    await disableSingleLooping();
    set({
      playUntilLastTrack: true,
      isLoopingSingle: false,
      stopAfterCurrentTrack: false,
      isLoopingQueue: false,
    });
  },

  toggleLoopStates: async () => {
    const {
      isLoopingSingle,
      isLoopingQueue,
      playUntilLastTrack,
      stopAfterCurrentTrack,
    } = get();
    if (isLoopingSingle) {
      await get().enableQueueLooping();
    } else if (isLoopingQueue) {
      await get().enablePlayUntilLastTrack();
    } else if (playUntilLastTrack) {
      await get().enableStopAfterCurrentTrack();
    } else if (stopAfterCurrentTrack) {
      await get().disableSingleLooping();
    }
  },

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

  resetPlayer: async () => {
    const { playbackInstance } = get();
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
    }
    set((state) => ({ ...state, ...InitialState }));
  },
}));
