import { create } from 'zustand';
import { Audio } from 'expo-av';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from './useAuthStore';
import { AxiosInstance } from 'axios';
import TrackPlayer, { RepeatMode, State } from 'react-native-track-player';
import { calculatePercentage } from '@/utils/helpers/number';
import {
  PLAYBACK_PERCENTAGE_TO_TRIGGER_PLAY,
  SLEEP_TIMER_OPTIONS,
  SleepTimerLabel,
} from '@/utils/constants';

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
  queueId: null,
  msPlayed: 0,
  timeRemaining: SLEEP_TIMER_OPTIONS['None'],
  timerLabel: 'None' as SleepTimerLabel,
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
  api: () => AxiosInstance;
  isThisQueuePlaying: (id?: string, softCheck?: boolean) => boolean;
  isThisTrackPlaying: (id?: string, softCheck?: boolean) => boolean;
  msPlayed: number;
  setMsPlayed: (ms: number) => void;
  increaseMsPlayed: () => void;
  timeRemaining: number | null;
  timerLabel: SleepTimerLabel;
  setTimerSeconds: (seconds: number | null) => void;
  setTimerLabel: (timerType: SleepTimerLabel) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackPosition: (ms: number) => void;
  setCurrentTrackIndex: (index: number) => void;
}

// TODO : Sleep Timer

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...InitialState,
  setCurrentTrackIndex: (index: number) => {
    set({ currentTrackIndex: index });
  },
  setPlaybackPosition(ms: number) {
    set({ playbackPosition: ms });
  },
  setIsPlaying: (isPlaying: boolean) => {
    set({ isPlaying });
  },
  setTimerSeconds: (seconds: number | null) => {
    set({ timeRemaining: seconds });
    const interval = setInterval(() => {
      const { timeRemaining, playbackInstance } = get();
      if (timeRemaining && timeRemaining > 0) {
        console.log('Time Remaining', timeRemaining);
        set({ timeRemaining: timeRemaining - 1 });
      } else {
        console.log('Clearing Interval and pausing');
        clearInterval(interval);
        // playbackInstance?.pauseAsync();
        TrackPlayer.pause();
        set({ timeRemaining: null });
      }
    }, 1000);
  },
  setTimerLabel: (timerLabel: SleepTimerLabel) => {
    const { setTimerSeconds } = get();
    setTimerSeconds(SLEEP_TIMER_OPTIONS[timerLabel]);
    set({ timerLabel });
  },
  volume: 1,
  api: () => useAuthStore.getState().api,
  setMsPlayed: (ms: number) => {
    set({ msPlayed: ms });
  },
  increaseMsPlayed: () => {
    set((state) => {
      const { msPlayed, currentTrack, api } = state;

      const oldPercentagePlayed = calculatePercentage(
        msPlayed,
        currentTrack()?.trackDuration || 0
      );

      if (oldPercentagePlayed >= PLAYBACK_PERCENTAGE_TO_TRIGGER_PLAY) {
        return { msPlayed };
      }

      const newMsPlayed = msPlayed + 1000;

      const newPercentagePlayed = calculatePercentage(
        newMsPlayed,
        currentTrack()?.trackDuration || 0
      );

      if (newPercentagePlayed >= PLAYBACK_PERCENTAGE_TO_TRIGGER_PLAY) {
        try {
          api().post(`/tracks/play/${currentTrack()?.id}`);
          // console.log('API Call to increase play count');
        } catch (error) {
          console.log('Error playing track', error);
        }
      }

      return { msPlayed: newMsPlayed };
    });
  },

  didJustFinish: false,

  isAsyncOperationPending: false,

  setQueueId: (queueId: string) => {
    set({ queueId });
  },

  setIsAsyncOperationPending: (isAsyncOperationPending: boolean) => {
    set({ isAsyncOperationPending });
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
    const tracksToAdd = tracks.map((track) => ({
      url: track.src,
      title: track.title,
      artwork: track.cover || undefined,
      artist: track.creator?.profile?.name || track.creator?.username,
      duration: track.trackDuration / 1000,
      id: track.id,
    }));
    TrackPlayer.setQueue(tracksToAdd);
    set({ tracks, queueId: tracks[0].id });
    const { playbackInstance, currentTrack } = get();
    // if (!playbackInstance || !currentTrack()) return;
    // tracks.forEach((track) => {
    //   if (track.id === currentTrack()?.id) {
    //     playbackInstance?.loadAsync({ uri: track.src }, {}, false);
    //   }
    // });
  },

  loadTrack: async (index: number) => {
    try {
      const {
        volume,
        playbackSpeed,
        isLoopingQueue,
        isLoopingSingle,
        playUntilLastTrack,
        tracks,
        setMsPlayed,
      } = get();

      const { title, creator, albums, genre, createdAt, cover } = tracks[index];

      setMsPlayed(0);
      TrackPlayer.skip(index);
      TrackPlayer.seekTo(0);
      TrackPlayer.setVolume(volume);
      TrackPlayer.setRate(playbackSpeed);
      TrackPlayer.updateNowPlayingMetadata({
        title,
        artist: creator?.profile?.name || creator?.username || 'Unknown Artist',
        album: albums?.[0]?.title || 'Unknown Album',
        genre: genre?.name || 'Unknown Genre',
        date: createdAt,
        artwork: cover || undefined,
        description: title,
      });

      // const { title, creator, albums, genre, createdAt, cover } = rest;

      // // Play
      // if (!src || !id) return;

      // newPlaybackInstance.loadAsync(
      //   { uri: src },
      //   {
      //     progressUpdateIntervalMillis: 1000,
      //     shouldPlay: true,
      //     volume,
      //     isLooping: isLoopingSingle,
      //     rate: playbackSpeed,
      //   },
      //   true
      // );

      // newPlaybackInstance.setOnPlaybackStatusUpdate((status) => {
      //   if (status.isLoaded) {
      //     increaseMsPlayed();
      //     TrackPlayer.setVolume(0);
      //     TrackPlayer.seekTo(status.positionMillis / 1000);
      //     TrackPlayer.play();

      //     set({
      //       playbackPosition: status.positionMillis,
      //       playbackDuration: status.durationMillis ?? 0,
      //       isPlaying: status.isPlaying,
      //       isBuffering: status.isBuffering,
      //       playbackSpeed: status.rate,
      //       isLoopingSingle: status.isLooping,
      //       ...(status.isLooping && {
      //         isLoopingQueue: false,
      //         playUntilLastTrack: false,
      //         stopAfterCurrentTrack: false,
      //       }),
      //       isMuted: status.isMuted,
      //       isLoaded: status.isLoaded,
      //       volume: status.volume,
      //       currentTrackIndex: index,
      //       didJustFinish: status.didJustFinish,
      //     });

      //     if (status.isPlaying) {
      //       TrackPlayer.play();
      //     } else if (!status.isBuffering) {
      //       TrackPlayer.pause();
      //     }
      //     if (status.didJustFinish) {
      //       if (isLoopingSingle) {
      //         TrackPlayer.seekTo(0);
      //         return;
      //       }
      //       if (stopAfterCurrentTrack) {
      //         TrackPlayer.stop();
      //         set({ currentTrackIndex: null });
      //         return;
      //       }
      //       if (isLoopingQueue) {
      //         nextTrack();
      //         TrackPlayer.skipToNext();
      //         return;
      //       }
      //       if (playUntilLastTrack && index !== tracks.length - 1) {
      //         nextTrack();
      //         TrackPlayer.skipToNext();
      //         return;
      //       } else {
      //         TrackPlayer.stop();
      //         set({ currentTrackIndex: null });
      //         return;
      //       }
      //     }
      //   }
      // });

      set({
        // playbackInstance: newPlaybackInstance,
        currentTrackIndex: index,
        playbackError: null,
      });
    } catch (error) {
      TrackPlayer.reset();
      console.log('Error loading track', error);
      set({ playbackError: error as string });
    }
  },

  playPause: async (play = false) => {
    const { isPlaying } = get();

    if (play) {
      TrackPlayer.play();
    } else {
      if (isPlaying) {
        TrackPlayer.pause();
      } else {
        TrackPlayer.play();
      }
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
    loadTrack(index);
    playPause(true);
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
    loadTrack(nextIndex);
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
    loadTrack(prevIndex);
  },

  seek: async (position: number) => {
    // const { playbackInstance, setIsAsyncOperationPending } = get();
    TrackPlayer.seekTo(position / 1000);
    // if (playbackInstance) {
    //   setIsAsyncOperationPending(true);
    //   const start = Date.now();
    //   await playbackInstance.setPositionAsync(position).finally(() => {
    //     setIsAsyncOperationPending(false);
    //     console.log('Seeking took', Date.now() - start, 'ms');
    //   });
    // }
  },

  setVolume: async (volume: number) => {
    TrackPlayer.setVolume(volume);
    // const { playbackInstance } = get();

    // if (playbackInstance) {
    //   await playbackInstance.setVolumeAsync(volume);
    // }
  },

  setSpeed: async (speed: number) => {
    TrackPlayer.setRate(speed);
    // const { playbackInstance } = get();

    // if (playbackInstance) {
    //   await playbackInstance.setRateAsync(speed, true);
    // }
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
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      // await playbackInstance.setIsLoopingAsync(true);
    }
  },

  disableSingleLooping: async () => {
    // const { playbackInstance } = get();
    set({ isLoopingSingle: false });
    // if (playbackInstance) {
    //   await playbackInstance.setIsLoopingAsync(false);
    // }
    TrackPlayer.setRepeatMode(RepeatMode.Off);
  },

  enableQueueLooping: () => {
    const { disableSingleLooping } = get();
    disableSingleLooping();
    set({
      isLoopingQueue: true,
      playUntilLastTrack: false,
      stopAfterCurrentTrack: false,
    });
    TrackPlayer.setRepeatMode(RepeatMode.Queue);
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
    // const { playbackInstance, playbackPosition } = get();

    // const newPosition = Math.max(playbackPosition - seconds * 1000, 0);

    // await playbackInstance?.setPositionAsync(newPosition);
    const { playbackPosition } = get();
    const newPosition = Math.max(playbackPosition - seconds * 1000, 0);
    await TrackPlayer.seekTo(newPosition / 1000);
  },

  seekForward: async (seconds: number) => {
    // const { playbackInstance, playbackPosition, playbackDuration } = get();

    // const newPosition = Math.min(
    //   playbackPosition + seconds * 1000,
    //   playbackDuration
    // );

    // await playbackInstance?.setPositionAsync(newPosition);
    const { playbackPosition, playbackDuration } = get();
    const newPosition = Math.min(
      playbackPosition + seconds * 1000,
      playbackDuration
    );
    await TrackPlayer.seekTo(newPosition / 1000);
  },

  resetPlayer: async () => {
    // const { playbackInstance } = get();
    // if (playbackInstance) {
    //   await playbackInstance.unloadAsync();
    // }
    set((state) => ({ ...state, ...InitialState }));
    TrackPlayer.reset();
  },

  isThisQueuePlaying: (id?: string, softCheck = false) => {
    if (!id) return false;
    const { currentTrack, queueId, isPlaying } = get();
    if (!currentTrack) return false;
    return queueId === id && (isPlaying || softCheck);
  },

  isThisTrackPlaying: (id?: string, softCheck = false) => {
    if (!id) return false;
    const { currentTrack, isPlaying } = get();
    if (!currentTrack) return false;
    return currentTrack()?.id === id && (isPlaying || softCheck);
  },
}));
