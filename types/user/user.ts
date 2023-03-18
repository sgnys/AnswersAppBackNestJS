export enum UserRoles {
  ADMIN = 1,
  MEMBER,
}

export type UserLoginRes = UserAccountActivationRes;

export interface UserAccountActivationRes {
  id: string;
  role: UserRoles;
  email: string;
  name: string;
}

export interface UserLoginReg {
  email: string;
  password: string;
}

export interface ResetPasswordReq {
  resetToken: string;
  newPass: string;
  confirm: string;
}

export interface UserRegisterReq {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export interface RegisterUserResponse {
  status: number;
  message: string;
}

export interface AnswerUserRes {
  id: string;
  name: string;
  email: string;
}
