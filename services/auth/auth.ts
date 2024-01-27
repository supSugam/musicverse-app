import { api } from '@/utils/constants';
import { AxiosResponse } from 'axios';

// Path: services/auth/auth.ts

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<AxiosResponse<any>> => {
  return await api.post('/auth/login', credentials);
};

export const register = async (registerData: {
  email: string;
  password: string;
  username: string;
}) => {
  return await api.post('/auth/register', registerData);
};
