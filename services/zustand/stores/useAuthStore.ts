import { create } from 'zustand';
import { api } from '@/utils/constants';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { registerUser, resendOtp, verifyOtp } from '@/services/auth/auth';
import {
  ILoginDTO,
  IRegisterUserDTO,
  IVerifyOtpDTO,
} from '@/services/auth/IAuth';
import { ICurrentUser, IUserProfile } from '@/utils/Interfaces/IUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob'; // <- polyfill here
import { BASE_URL } from '@env';
import { toastResponseMessage } from '@/utils/toast';
import { useProfileQuery } from '@/hooks/react-query/useProfileQuery';
interface AuthStore {
  currentUser: ICurrentUser | null;
  currentUserProfile: IUserProfile | null;
  currentUserOnHold: ICurrentUser | null;
  api: AxiosInstance;
  setCurrentUserProfile: (user: IUserProfile) => void;
  setCurrentUserOnHold: (user: ICurrentUser | null) => void;
  setApi: (api: AxiosInstance) => void;
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
    currentUserProfile: null,
    currentUserOnHold: null,
    api: api,
    setApi: (api) => {
      set(() => ({ api }));
    },
    setCurrentUserOnHold: (currentUserOnHold) => {
      set(() => ({ currentUserOnHold }));
    },
    setCurrentUser: async (currentUser) => {
      set(() => ({ currentUser }));
      await AsyncStorage.setItem('current-user', JSON.stringify(currentUser));
    },
    setCurrentUserProfile: (currentUserProfile) => {
      set(() => ({ currentUserProfile }));
    },
    login: async (payload: ILoginDTO) => {
      const { setCurrentUser, setCurrentUserOnHold, currentUserOnHold } = get();
      const response = await api.post('/auth/login', payload);
      const { hasCompletedProfile, access_token: accessToken } =
        response.data.result;

      try {
        const decodedToken = jwtDecode(accessToken);
        if (accessToken) {
          const axiosInstance = axios.create({
            baseURL: BASE_URL,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Update the Zustand store with the new Axios instance
          set(() => ({ api: axiosInstance }));

          const currentUser = {
            ...decodedToken,
            accessToken,
          } as ICurrentUser;

          if (hasCompletedProfile) {
            setCurrentUser(currentUser);
            setCurrentUserOnHold(null);
          } else {
            setCurrentUserOnHold(currentUser);
            setCurrentUser(null);
          }
        }
      } catch (e) {
        toastResponseMessage({
          content: 'An error occurred while trying to login',
          type: 'error',
        });
      } finally {
        return response;
      }
    },

    register: async (payload: IRegisterUserDTO) => {
      return await registerUser(payload);
    },
    logout: async () => {
      try {
        await AsyncStorage.removeItem('current-user');
        set(() => ({
          currentUser: null,
          currentUserProfile: null,
          currentUserOnHold: null,
        }));
        console.log('logged out');
      } catch (error) {
        console.error('error', error);
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
      const { setCurrentUser } = get();
      const userJson = await AsyncStorage.getItem('current-user');
      if (userJson) {
        const user = JSON.parse(userJson) as ICurrentUser;
        const axiosInstance = axios.create({
          baseURL: BASE_URL,
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        set(() => ({ api: axiosInstance }));
        if (user.exp < Date.now() / 1000) {
          await AsyncStorage.removeItem('current-user');
          setCurrentUser(null);
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
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
