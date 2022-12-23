export enum UserRoles {
  ADMIN = 1,
  MEMBER,
}

export type RegisterUserResponse = {
  statusCode: number;
  message: string;
};
