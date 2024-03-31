import { IAlbumDetails } from '@/utils/Interfaces/IAlbum';
import { IPlaylistDetails } from '@/utils/Interfaces/IPlaylist';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';
import { RecentSearchUtility } from '@/utils/helpers/ts-utilities';
import { NavigationContainerRef } from '@react-navigation/native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RecentSearch =
  | RecentSearchUtility<ITrackDetails, 'track'>
  | RecentSearchUtility<IAlbumDetails, 'album'>
  | RecentSearchUtility<IPlaylistDetails, 'playlist'>
  | RecentSearchUtility<IUserWithProfile, 'artist'>
  | RecentSearchUtility<IUserWithProfile, 'user'>;

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
    set((state) => ({
      recentSearches: [search, ...state.recentSearches],
    }));
    const { recentSearches } = get();

    AsyncStorage.setItem(
      'recentSearches',
      JSON.stringify([search, ...recentSearches])
    );
  },
  removeRecentSearch: (id: string) => {
    set((state) => ({
      recentSearches: state.recentSearches.filter(
        (search) => search.data.id !== id
      ),
    }));
    const { recentSearches } = get();
    AsyncStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  },
  clearAllRecentSearches: () => {
    set({ recentSearches: [] });
    AsyncStorage.removeItem('recentSearches');
  },
}));
