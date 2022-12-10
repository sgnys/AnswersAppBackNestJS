export enum UserRoles {
  ADMIN = 1,
  MEMBER,
}

export type RegisterUserResponse =
  | {
      id: string;
      name: string;
      email: string;
    }
  | {
      statusCode: number;
      message: string;
    };
