import { UserRole } from '@/utils/Interfaces/IUser';

export enum CredentialsType {
  USERNAME = 'USERNAME',
  EMAIL = 'EMAIL',
}

export interface ILoginDTO {
  usernameOrEmail: string;
  password: string;
  credentialsType: CredentialsType;
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
