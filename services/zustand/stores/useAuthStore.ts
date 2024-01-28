import { create } from 'zustand';
import { api } from '@/utils/constants';
import { AxiosResponse } from 'axios';
import { IRegisterUserDTO, registerUser } from '@/services/auth/auth';

type User = any;

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<AxiosResponse<any>>;
  register: (payload: IRegisterUserDTO) => Promise<AxiosResponse<any>>;
  logout: () => Promise<void>;
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
  })
);
