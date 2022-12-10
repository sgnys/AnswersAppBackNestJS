import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { sign } from 'jsonwebtoken';
import { RegisterUserResponse } from '../../types';
import { REGEX } from '../utils/constants';

@Injectable()
export class UserService {
  async register(
    userRegister: UserRegisterRequestDto,
  ): Promise<RegisterUserResponse> {
    const user = new UserEntity();
    const { email, password, confirm } = userRegister;

    if (
      !REGEX.PASSWORD_RULE.test(password) ||
      !REGEX.PASSWORD_RULE.test(confirm)
    ) {
      throw new BadRequestException(
        'Password and confirm password should have 1 upper case, lower case letter along with a number and special character.',
      );
    }

    if (password !== confirm) {
      throw new BadRequestException(
        'password and confirm password must be equal',
      );
    }

    const isUserExist = await this.getUserByEmail(email);
    console.log(userRegister);
    console.log(isUserExist);

    if (isUserExist) {
      throw new BadRequestException('This user already exist in database');
    }

    const token = sign({ email, password }, process.env.JWT_ACC_ACTIVATE, {
      expiresIn: '20m',
    });
    console.log(token);
    console.log('SEND EMAIL'); //TODO

    return {
      statusCode: 200,
      message: 'Email has been sent, kindly activate your account',
    };
  }

  async getUserById(id: string): Promise<UserEntity | undefined> {
    return await UserEntity.findOne({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    return await UserEntity.findOne({
      where: { email },
    });
  }
}
