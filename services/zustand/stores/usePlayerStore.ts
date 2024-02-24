import create from 'zustand';
import { Audio } from 'expo-av';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';

type PlayerState = {
  isPlaying: boolean;
  currentTrackIndex: number;
  tracks: ITrackDetails[];
  playbackInstance: Audio.Sound | null;
  playbackPosition: number;
  playbackDuration: number;
  playbackSpeed: number;
  isLooping: boolean;
  isQueueLooping: boolean;
  playbackError: string | null;
  loadTrack: (index: number) => Promise<void>;
};

const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  currentTrackIndex: 0,
  tracks: [],
  playbackInstance: null,
  playbackPosition: 0,
  playbackDuration: 0,
  playbackSpeed: 1.0,
  isLooping: false,
  isQueueLooping: false,
  playbackError: null,

  loadTrack: async (index: number) => {
    try {
      const { tracks, playbackInstance } = get();
      if (playbackInstance) await playbackInstance.unloadAsync();
      const newPlaybackInstance = new Audio.Sound();
      const { src } = tracks[index];
      await newPlaybackInstance.loadAsync({ uri: src }, {}, false);
      newPlaybackInstance.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          set((state) => ({
            playbackPosition: status.positionMillis,
            playbackDuration: status.durationMillis,
            isPlaying: status.isPlaying,
          }));
        }
      });

      set((state) => ({
        playbackInstance: newPlaybackInstance,
        currentTrackIndex: index,
        playbackError: null,
      }));
    } catch (error: any) {
      set((state) => ({ playbackError: error.message }));
    }
  },

  playPause: async () => {
    const { isPlaying, playbackInstance } = get();
    if (playbackInstance) {
      if (isPlaying) await playbackInstance.pauseAsync();
      else await playbackInstance.playAsync();
    }
  },

  nextTrack: () => {
    const { currentTrackIndex, tracks } = get();
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    usePlayerStore.getState().loadTrack(nextIndex);
  },

  prevTrack: () => {
    const { currentTrackIndex, tracks } = get();
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    usePlayerStore.getState().loadTrack(prevIndex);
  },

  seek: (position: number) => {
    const { playbackInstance } = get();
    if (playbackInstance) {
      playbackInstance.setPositionAsync(position);
    }
  },

  setSpeed: (speed: number) => {
    const { playbackInstance } = get();
    if (playbackInstance) {
      playbackInstance.setRateAsync(speed, true);
    }
  },

  setLooping: (isLooping: boolean) => {
    const { playbackInstance } = get();
    if (playbackInstance) {
      playbackInstance.setIsLoopingAsync(isLooping);
    }
  },

  setQueueLooping: (isQueueLooping: boolean) =>
    set((state) => ({ isQueueLooping })),

  // Additional features
  seekBackward: (seconds: number) => {
    const { playbackInstance, playbackPosition } = get();
    const newPosition = Math.max(playbackPosition - seconds * 1000, 0);
    playbackInstance?.setPositionAsync(newPosition);
  },

  seekForward: (seconds: number) => {
    const { playbackInstance, playbackPosition, playbackDuration } = get();
    const newPosition = Math.min(
      playbackPosition + seconds * 1000,
      playbackDuration
    );
    playbackInstance?.setPositionAsync(newPosition);
  },

  toggleQueueLooping: () => {
    const { isQueueLooping } = get();
    usePlayerStore.setState({ isQueueLooping: !isQueueLooping });
  },
}));

export default usePlayerStore;
