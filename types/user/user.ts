import { AuthLoginReqDto } from '../../src/auth/dto/auth-login-req.dto';
import { UserRegisterReqDto } from '../../src/user/dto/user-register.req.dto';
import { AuthLoginResDto } from '../../src/auth/dto/auth-login-res.dto';
import { UserAccountActivationResDto } from '../../src/user/dto/user-account-activation.res.dto';

export enum UserRoles {
  ADMIN = 1,
  MEMBER,
}

export type UserLoginReg = AuthLoginReqDto;

export type UserLoginRes = AuthLoginResDto;

export type UserRegisterReq = UserRegisterReqDto;

export type UserAccountActivationRes = UserAccountActivationResDto;

export type RegisterUserResponse = {
  status: number;
  message: string;
};
