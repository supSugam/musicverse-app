import { create } from 'zustand';
import { MMKVStorage, api } from '@/utils/constants';
import { AxiosResponse } from 'axios';

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

export const useAuthStore = create(
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
        const response = await api.post('/auth/register', {
          email,
          password,
          username,
        });
        MMKVStorage.set('user', response.data);
        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    logout: async () => {
      try {
        await api.post('/auth/logout');
        MMKVStorage.delete('user');
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  })
);
