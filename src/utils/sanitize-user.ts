import { UserEntity } from '../user/user.entity';
import { UserAccountActivationRes } from 'types';

export const sanitizeUser = (user: UserEntity): UserAccountActivationRes => {
  const { id, role, email, name } = user;

  return { id, role, email, name };
};
