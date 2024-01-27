import { create } from 'zustand';
import { api } from '@/utils/constants';
import { AxiosResponse } from 'axios';
import { register } from '@/services/auth/auth';

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
  register: ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) => Promise<AxiosResponse<any>>;
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
        console.log(response.data);
        // MMKVStorage.set('access_token', response.data.access_token);
        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    register: async ({ email, password, username }) => {
      try {
        const response = await register({ email, password, username });
        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
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
