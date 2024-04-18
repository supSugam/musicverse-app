import { api } from '@/utils/constants';
import { AxiosResponse } from 'axios';

import { ILoginDTO, IRegisterUserDTO, IVerifyOtpDTO } from './IAuth';
import { SuccessResponse } from '@/utils/Interfaces/IApiResponse';

export const login = async (
  credentials: ILoginDTO
): Promise<AxiosResponse<any>> => {
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

export const verifyOtp = async (
  payload: IVerifyOtpDTO
): Promise<AxiosResponse<SuccessResponse<{ message: string }>>> => {
  return await api.post('/auth/verify-otp', payload);
};

export const resendOtp = async (
  email: string
): Promise<AxiosResponse<SuccessResponse<{ message: string }>>> => {
  return await api.post('/auth/resend-otp', { email });
};
