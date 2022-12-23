export enum UserRoles {
  ADMIN = 1,
  MEMBER,
}

export type ActivateUserResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
};

export type RegisterUserResponse = {
  statusCode: number;
  message: string;
};
