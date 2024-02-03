import { create } from 'zustand';
import { api } from '@/utils/constants';
import { AxiosResponse } from 'axios';
import { registerUser, resendOtp, verifyOtp } from '@/services/auth/auth';
import {
  ILoginDTO,
  IRegisterUserDTO,
  IVerifyOtpDTO,
} from '@/services/auth/IAuth';
import { ICurrentUser, IUser } from '@/utils/enums/IUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
interface AuthStore {
  currentUser: ICurrentUser | null;
  setCurrentUser: (user: ICurrentUser | null) => void;
  login: (payload: ILoginDTO) => Promise<AxiosResponse<any>>;
  register: (payload: IRegisterUserDTO) => Promise<AxiosResponse<any>>;
  logout: () => Promise<void>;
  verifyOtp: (payload: IVerifyOtpDTO) => Promise<AxiosResponse<any>>;
  resendOtp: (email: string) => Promise<AxiosResponse<any>>;
  initialize: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>(
  (set, get): AuthStore => ({
    currentUser: null,
    setCurrentUser: async (currentUser) => {
      set(() => ({ currentUser }));
      await AsyncStorage.setItem('current-user', JSON.stringify(currentUser));
    },
    login: async (payload: ILoginDTO) => {
      return await api.post('/auth/login', payload);
    },
    register: async (payload: IRegisterUserDTO) => {
      return await registerUser(payload);
    },
    logout: async () => {
      try {
        await AsyncStorage.removeItem('current-user');
        set(() => ({ currentUser: null }));
      } catch (error) {
        throw error;
      }
    },
    verifyOtp: async (payload: IVerifyOtpDTO) => {
      return await verifyOtp(payload);
    },
    resendOtp: async (email: string) => {
      return await resendOtp(email);
    },
    initialize: async (): Promise<boolean> => {
      const user = await AsyncStorage.getItem('current-user');
      if (user) {
        if (JSON.parse(user).exp < Date.now() / 1000) {
          await AsyncStorage.removeItem('current-user');
          set(() => ({ currentUser: null }));
          return false;
        }
        set(() => ({ currentUser: JSON.parse(user) }));
      } else {
        set(() => ({ currentUser: null }));
        return false;
      }
      return true;
    },
  })
);

//   {
//     name: 'auth-storage',
//     getStorage: () => AsyncStorage,
//     serialize: JSON.stringify,
//     deserialize: JSON.parse,
//   }
// );
