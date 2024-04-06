import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import { IPlaylistDetails } from '@/utils/Interfaces/IPlaylist';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';
import { RecentSearchUtility } from '@/utils/helpers/ts-utilities';
import { NavigationContainerRef } from '@react-navigation/native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INotification } from '@/utils/Interfaces/INotification';

export type RecentSearch =
  | RecentSearchUtility<ITrackDetails, 'Track'>
  | RecentSearchUtility<IAlbumDetails, 'Album'>
  | RecentSearchUtility<IPlaylistDetails, 'Playlist'>
  | RecentSearchUtility<IUserWithProfile, 'Artist'>
  | RecentSearchUtility<IUserWithProfile, 'User'>;

interface IAppGlobalState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  rootNavigation?: NavigationContainerRef<ReactNavigation.RootParamList> | null;
  setRootNavigation: (
    ref: NavigationContainerRef<ReactNavigation.RootParamList>
  ) => void;

  activeTab: string | null;
  setActiveTab: (activeTab: string | null) => void;
  recentSearches: RecentSearch[];
  addRecentSearch: (search: RecentSearch) => void;
  removeRecentSearch: (id: string) => void;
  clearAllRecentSearches: () => void;
  updateRecentSearches: () => void;
}

export const useAppState = create<IAppGlobalState>((set, get) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  rootNavigation: null,
  setRootNavigation: (
    ref: NavigationContainerRef<ReactNavigation.RootParamList>
  ) => set({ rootNavigation: ref }),
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
}));
