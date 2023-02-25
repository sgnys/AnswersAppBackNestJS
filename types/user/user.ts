import { AuthLoginReqDto } from '../../src/auth/dto/auth-login-req.dto';
import { UserRegisterReqDto } from '../../src/user/dto/user-register.req.dto';

export enum UserRoles {
  ADMIN = 1,
  MEMBER,
}

export type UserLoginReg = AuthLoginReqDto;

export type UserLoginRes = ActivateUserResponse;

export type UserRegister = UserRegisterReqDto;

export interface ActivateUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
}

export type RegisterUserResponse = {
  status: number;
  message: string;
};
