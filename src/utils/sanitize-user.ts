import { UserEntity } from '../user/user.entity';
import { ActivateUserResponse } from '../../types';

export const sanitizeUser = (user: UserEntity): ActivateUserResponse => {
  const { id, role, email, name } = user;

  return { id, role, email, name };
};
