import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import { IPlaylistDetails } from '@/utils/Interfaces/IPlaylist';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';
import { RecentSearchUtility } from '@/utils/helpers/ts-utilities';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toastResponseMessage } from '@/utils/toast';
import Share, { ShareOptions } from 'react-native-share';
import * as Linking from 'expo-linking';

export type RecentSearch =
  | RecentSearchUtility<ITrackDetails, 'Track'>
  | RecentSearchUtility<IAlbumDetails, 'Album'>
  | RecentSearchUtility<IPlaylistDetails, 'Playlist'>
  | RecentSearchUtility<IUserWithProfile, 'Artist'>
  | RecentSearchUtility<IUserWithProfile, 'User'>;

interface IAppGlobalState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  activeTab: string | null;
  setActiveTab: (activeTab: string | null) => void;
  recentSearches: RecentSearch[];
  addRecentSearch: (search: RecentSearch) => void;
  removeRecentSearch: (id: string) => void;
  clearAllRecentSearches: () => void;
  updateRecentSearches: () => void;
  share: (options: ShareOptions) => void;
}

export const useAppState = create<IAppGlobalState>((set, get) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });

    // If isLoading is set to true, set a timeout to set it to false after 15 seconds
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        set({ isLoading: false });
      }, 15000); // 15 seconds

      // Clear the timeout if isLoading is set to false before 15 seconds
      return () => clearTimeout(timeoutId);
    }
  },
  activeTab: 'Home',
  setActiveTab: (activeTab: string | null) => set({ activeTab }),
  // For recent searches
  recentSearches: [],
  addRecentSearch: (search: RecentSearch) => {
    const { recentSearches, updateRecentSearches } = get();
    AsyncStorage.setItem(
      'recentSearches',
      JSON.stringify([
        search,
        ...recentSearches.filter((s) => s.data.id !== search.data.id),
      ])
    );
    updateRecentSearches();
  },
  removeRecentSearch: (id: string) => {
    set((state) => ({
      recentSearches: state.recentSearches.filter(
        (search) => search.data.id !== id
      ),
    }));
    const { recentSearches, updateRecentSearches } = get();
    AsyncStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    updateRecentSearches();
  },
  clearAllRecentSearches: () => {
    const { updateRecentSearches } = get();
    AsyncStorage.removeItem('recentSearches');
    updateRecentSearches();
  },
  updateRecentSearches: async () => {
    const recentSearches = await AsyncStorage.getItem('recentSearches');
    if (recentSearches) {
      set({ recentSearches: JSON.parse(recentSearches) });
    } else {
      set({ recentSearches: [] });
    }
  },

  // Linking and Sharing

  share: async (options: ShareOptions) => {
    try {
      await Share.open(options);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  },

  createUrl: ([path, options]: Parameters<typeof Linking.createURL>) => {
    return Linking.createURL(path, options);
  },
}));
