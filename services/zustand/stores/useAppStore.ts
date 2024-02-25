import { create } from 'zustand';
interface IAppGlobalState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAppState = create<IAppGlobalState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
