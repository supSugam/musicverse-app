import { api } from '@/utils/constants';
import { UserRole } from '@/utils/enums/IUser';
import { AxiosResponse } from 'axios';

// Path: services/auth/auth.ts

// Payload Interfaces

export interface IRegisterUserDTO {
  email: string;
  password: string;
  username: string;
  role?: UserRole;
}

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<AxiosResponse<any>> => {
  return await api.post('/auth/login', credentials);
};

// Register User
export const registerUser = async (
  registerData: IRegisterUserDTO
): Promise<AxiosResponse<any>> => {
  return await api.post('/auth/register', registerData, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
