import { create } from 'zustand';
import { IUser, IUserProfile } from '@/utils/Interfaces/IUser';

interface IUserStore {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  profile: IUserProfile | null;
  setProfile: (profile: IUserProfile | null) => void;
}

export const useUserStore = create<IUserStore>(
  (set): IUserStore => ({
    user: null,
    setUser: (user) => {
      set(() => ({ user }));
    },
    profile: null,
    setProfile: (profile) => {
      set(() => ({ profile }));
    },
  })
);
