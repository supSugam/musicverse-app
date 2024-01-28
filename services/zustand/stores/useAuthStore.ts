import { create } from 'zustand';
import { api } from '@/utils/constants';
import { AxiosResponse } from 'axios';
import { registerUser, resendOtp, verifyOtp } from '@/services/auth/auth';
import {
  ILoginDTO,
  IRegisterUserDTO,
  IVerifyOtpDTO,
} from '@/services/auth/IAuth';

type User = any;

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (payload: ILoginDTO) => Promise<AxiosResponse<any>>;
  register: (payload: IRegisterUserDTO) => Promise<AxiosResponse<any>>;
  logout: () => Promise<void>;
  verifyOtp: (payload: IVerifyOtpDTO) => Promise<AxiosResponse<any>>;
  resendOtp: (email: string) => Promise<AxiosResponse<any>>;
}

export const useAuthStore = create<AuthStore>(
  (set): AuthStore => ({
    user: null,
    setUser: (user) => {
      set(() => ({ user }));
    },
    login: async ({ email, password }) => {
      try {
        const response = await api.post('/auth/login', {
          email,
          password,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    register: async (payload: IRegisterUserDTO) => {
      return await registerUser(payload);
    },
    logout: async () => {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    verifyOtp: async (payload: IVerifyOtpDTO) => {
      return await verifyOtp(payload);
    },
    resendOtp: async (email: string) => {
      return await resendOtp(email);
    },
  })
);
