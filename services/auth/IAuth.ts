import { UserRole } from '@/utils/enums/IUser';

export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IRegisterUserDTO {
  email: string;
  password: string;
  username: string;
  role?: UserRole;
}
export interface IVerifyOtpDTO {
  otp: number;
  email: string;
}
