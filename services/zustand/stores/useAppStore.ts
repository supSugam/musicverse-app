import { NavigationContainerRef } from '@react-navigation/native';
import { create } from 'zustand';
interface IAppGlobalState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  rootNavigation?: NavigationContainerRef<ReactNavigation.RootParamList> | null;
  setRootNavigation: (
    ref: NavigationContainerRef<ReactNavigation.RootParamList>
  ) => void;
}

export const useAppState = create<IAppGlobalState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  rootNavigation: null,
  setRootNavigation: (
    ref: NavigationContainerRef<ReactNavigation.RootParamList>
  ) => set({ rootNavigation: ref }),
}));
