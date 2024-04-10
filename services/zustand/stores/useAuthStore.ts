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
import { clo } from '@/utils/helpers/Object';
interface AuthStore {
  fcmDeviceToken: string | null;
  setFcmDeviceToken: (fcmDeviceToken: string | null) => void;
  registerFcmToken: () => Promise<void>;
  deregisterFcmToken: () => Promise<void>;
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
  isApiAuthorized: () => boolean;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>(
  (set, get): AuthStore => ({
    isApiAuthorized: () => !!get().api.defaults.headers?.['Authorization'],
    refreshToken: async () => {
      const { api, isApiAuthorized, setCurrentUser } = get();
      if (!isApiAuthorized()) return;
      const response = await api.post('/auth/refresh-token');
      const { access_token: accessToken } = response.data.result;
      const decodedToken = jwtDecode(accessToken);
      const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      set(() => ({ api: axiosInstance }));
      const updatedUser = {
        ...decodedToken,
        accessToken,
      } as ICurrentUser;
      setCurrentUser(updatedUser);
      await AsyncStorage.setItem('current-user', JSON.stringify(updatedUser));
    },
    fcmDeviceToken: null,
    setFcmDeviceToken: (fcmDeviceToken: string | null) =>
      set({ fcmDeviceToken }),

    currentUser: null,
    currentUserProfile: null,
    currentUserOnHold: null,
    api,
    setApi: (api) => {
      set(() => ({ api }));
    },
    registerFcmToken: async () => {
      const { currentUser, fcmDeviceToken } = get();
      if (!currentUser || !fcmDeviceToken) return;
      await api.post(`/users/register-device/${fcmDeviceToken}`);
    },
    deregisterFcmToken: async () => {
      const { currentUser, fcmDeviceToken } = get();
      if (!currentUser || !fcmDeviceToken) return;
      await api.post(`/users/deregister-device/${fcmDeviceToken}`);
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
      const { setCurrentUser, setCurrentUserOnHold, registerFcmToken } = get();
      const response = await api.post('/auth/login', payload);
      // Register device token
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
            registerFcmToken();
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
      const { deregisterFcmToken } = get();
      try {
        await AsyncStorage.removeItem('current-user');
        set(() => ({
          currentUser: null,
          currentUserProfile: null,
          currentUserOnHold: null,
        }));
        deregisterFcmToken();
      } catch (error) {
        console.error('error', error);
        throw error;
      }
    },
    verifyOtp: async (payload: IVerifyOtpDTO) => await verifyOtp(payload),
    resendOtp: async (email: string) => await resendOtp(email),
    initialize: async (): Promise<true> => {
      const { setCurrentUser, deregisterFcmToken, refreshToken } = get();
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
          deregisterFcmToken();
        } else {
          await refreshToken();
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
