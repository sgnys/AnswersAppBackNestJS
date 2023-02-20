import { AuthLoginReqDto } from '../../src/auth/dto/auth-login-req.dto';

export enum UserRoles {
  ADMIN = 1,
  MEMBER,
}

export type UserLoginReg = AuthLoginReqDto;

export type UserLoginRes = ActivateUserResponse;

export interface ActivateUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
}

export type RegisterUserResponse = {
  statusCode: number;
  message: string;
};
