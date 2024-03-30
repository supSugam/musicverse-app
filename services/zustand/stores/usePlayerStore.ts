import { create } from 'zustand';
import { Audio } from 'expo-av';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { toastResponseMessage } from '@/utils/toast';
import { playATrack } from '@/services/api/play';

const InitialState = {
  isPlaying: false,
  isBuffering: false,
  isMuted: false,
  isLoaded: false,
  currentTrackIndex: null,
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
  isPlayerExpanded: false,
  queueId: null,
};

interface PlayerState {
  queueId: string | null;
  isPlaying: boolean;
  isAsyncOperationPending: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  isLoaded: boolean;
  currentTrackIndex: number | null;
  tracks: Partial<ITrackDetails>[];
  volume: number;
  playbackInstance: Audio.Sound | null;
  playbackPosition: number;
  playbackDuration: number;
  playbackSpeed: number;
  isLoopingSingle: boolean;
  isLoopingQueue: boolean;
  playUntilLastTrack: boolean;
  stopAfterCurrentTrack: boolean;
  playbackError: string | null;
  didJustFinish: boolean;
  isPlayerExpanded: boolean;
  setPlayerExpanded: (isPlayerExpanded: boolean) => void;
  togglePlayerExpanded: () => void;
  setIsAsyncOperationPending: (isAsyncOperationPending: boolean) => void;
  setQueueId: (queueId: string) => void;
  loadTrack: (index: number) => Promise<void>;
  updateTracks: (tracks: ITrackDetails[]) => void;
  isNextTrackAvailable: (ignoreLoopState?: boolean) => boolean;
  isPrevTrackAvailable: (ignoreLoopState?: boolean) => boolean;
  playPause: (play?: boolean) => void;
  playATrackById: (id: string) => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  currentTrack: () => Partial<ITrackDetails> | null;
  seek: (position: number) => Promise<void>;
  setSpeed: (speed: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  enableSingleLooping: () => Promise<void>;
  disableSingleLooping: () => Promise<void>;
  enableQueueLooping: () => void;
  enablePlayUntilLastTrack: () => void;
  enableStopAfterCurrentTrack: () => void;

  seekBackward: (seconds: number) => Promise<void>;
  seekForward: (seconds: number) => Promise<void>;
  toggleLoopStates: () => void;

  resetPlayer: () => void;
}

// TODO : Sleep Timer

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...InitialState,
  volume: 1,

  didJustFinish: false,

  isPlayerExpanded: false,
  isAsyncOperationPending: false,

  setQueueId: (queueId: string) => {
    set({ queueId });
  },

  setIsAsyncOperationPending: (isAsyncOperationPending: boolean) => {
    set({ isAsyncOperationPending });
  },

  setPlayerExpanded: (isPlayerExpanded: boolean) => {
    set({ isPlayerExpanded });
  },

  togglePlayerExpanded: () => {
    set((state) => ({ isPlayerExpanded: !state.isPlayerExpanded }));
  },

  currentTrack: () => {
    const { tracks, currentTrackIndex } = get();
    if (tracks.length === 0 || currentTrackIndex === null) return null;
    return tracks[currentTrackIndex] || null;
  },

  isNextTrackAvailable: (ignoreLoopState = false) => {
    const { currentTrackIndex, tracks, isLoopingQueue } = get();
    return (
      (currentTrackIndex !== null && currentTrackIndex > tracks.length - 1) ||
      isLoopingQueue ||
      ignoreLoopState
    );
  },

  isPrevTrackAvailable: (ignoreLoopState = false) => {
    const { currentTrackIndex, isLoopingQueue } = get();

    return (
      (currentTrackIndex !== null && currentTrackIndex > 0) ||
      isLoopingQueue ||
      ignoreLoopState
    );
  },

  updateTracks: (tracks: ITrackDetails[]) => {
    set({ tracks, queueId: tracks[0].id });
    const { playbackInstance, currentTrack } = get();
    tracks.forEach((track) => {
      if (track.id === currentTrack()?.id) {
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
        volume,
        playbackSpeed,
      } = get();

      if (playbackInstance) {
        await playbackInstance.unloadAsync();
      }
      const newPlaybackInstance = new Audio.Sound();

      const { src, id } = tracks[index];

      // Play

      if (!src || !id) return;
      playATrack(id);

      await newPlaybackInstance.loadAsync(
        { uri: src },
        {
          progressUpdateIntervalMillis: 1000,
          shouldPlay: true,
          volume,
          isLooping: isLoopingSingle,
          rate: playbackSpeed,
        },
        false
      );

      newPlaybackInstance.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded) {
          set({
            playbackPosition: status.positionMillis,
            playbackDuration: status.durationMillis ?? 0,
            isPlaying: status.isPlaying,
            isBuffering: status.isBuffering,
            playbackSpeed: status.rate,
            isLoopingSingle: status.isLooping,
            ...(status.isLooping && {
              isLoopingQueue: false,
              playUntilLastTrack: false,
              stopAfterCurrentTrack: false,
            }),
            isMuted: status.isMuted,
            isLoaded: status.isLoaded,
            volume: status.volume,
            currentTrackIndex: index,
            didJustFinish: status.didJustFinish,
          });

          if (status.didJustFinish) {
            if (isLoopingSingle || stopAfterCurrentTrack) {
              return;
            }
            if (isLoopingQueue) {
              await nextTrack();
              return;
            }
            if (playUntilLastTrack && index !== tracks.length - 1) {
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

  playPause: (play = false) => {
    const { isPlaying, playbackInstance, didJustFinish } = get();
    if (!playbackInstance) return;

    if (isPlaying && !play) {
      playbackInstance.setStatusAsync({ shouldPlay: false });
      playbackInstance.pauseAsync();
    } else {
      if (didJustFinish) {
        playbackInstance.replayAsync();
        return;
      }

      playbackInstance.setStatusAsync({ shouldPlay: true });
      playbackInstance.playAsync();
    }
  },

  playATrackById: async (id: string) => {
    const { tracks, loadTrack, playPause, currentTrack, isPlaying } = get();
    if (tracks.length === 0) return;
    const shouldPause = isPlaying && currentTrack()?.id === id;
    if (shouldPause) {
      playPause(false);
      return;
    }
    const index = tracks.findIndex((track) => track.id === id);
    if (index === -1) return;
    await loadTrack(index);
  },

  nextTrack: async () => {
    const {
      currentTrackIndex,
      tracks,
      loadTrack,
      isNextTrackAvailable,
      playPause,
    } = get();

    if (!isNextTrackAvailable(true) || currentTrackIndex === null) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    console.log('nextTrack', nextIndex);
    await loadTrack(nextIndex);
  },

  prevTrack: async () => {
    const {
      currentTrackIndex,
      tracks,
      loadTrack,
      isPrevTrackAvailable,
      playPause,
    } = get();
    if (!isPrevTrackAvailable(true) || currentTrackIndex === null) return;
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    await loadTrack(prevIndex);
  },

  seek: async (position: number) => {
    const { playbackInstance, setIsAsyncOperationPending } = get();

    if (playbackInstance) {
      setIsAsyncOperationPending(true);
      const start = Date.now();
      await playbackInstance.setPositionAsync(position).finally(() => {
        setIsAsyncOperationPending(false);
        console.log('Seeking took', Date.now() - start, 'ms');
      });
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

  enableQueueLooping: () => {
    const { disableSingleLooping } = get();
    disableSingleLooping();
    set({
      isLoopingQueue: true,
      playUntilLastTrack: false,
      stopAfterCurrentTrack: false,
    });
  },

  enableStopAfterCurrentTrack: () => {
    const { disableSingleLooping } = get();
    disableSingleLooping();
    set({
      stopAfterCurrentTrack: true,
      isLoopingSingle: false,
      playUntilLastTrack: false,
      isLoopingQueue: false,
    });
  },

  enablePlayUntilLastTrack: () => {
    const { disableSingleLooping } = get();
    disableSingleLooping();
    set({
      playUntilLastTrack: true,
      isLoopingSingle: false,
      stopAfterCurrentTrack: false,
      isLoopingQueue: false,
    });
  },

  toggleLoopStates: () => {
    const {
      isLoopingSingle,
      isLoopingQueue,
      playUntilLastTrack,
      stopAfterCurrentTrack,
      enableQueueLooping,
      enablePlayUntilLastTrack,
      enableStopAfterCurrentTrack,
      enableSingleLooping,
    } = get();
    let content: string = '';

    if (isLoopingSingle) {
      enableQueueLooping();
      content = 'Looping Queue';
    } else if (isLoopingQueue) {
      enablePlayUntilLastTrack();
      content = 'Play Until Last Song';
    } else if (playUntilLastTrack) {
      enableStopAfterCurrentTrack();
      content = 'Stop After Current Song';
    } else if (stopAfterCurrentTrack) {
      enableSingleLooping();
      content = 'Repeat Current Song';
    } else {
      enableSingleLooping();
      content = 'Repeat Current Song';
    }
    toastResponseMessage({
      content,
      type: 'info',
    });
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
