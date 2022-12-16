import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { sign, verify } from 'jsonwebtoken';
import { RegisterUserResponse } from '../../types';
import { REGEX } from '../utils/constants';

interface JwtRegisterPayload {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  async register(
    userRegister: UserRegisterRequestDto,
  ): Promise<RegisterUserResponse> {
    const { name, email, password, confirm } = userRegister;
    const payload: JwtRegisterPayload = {
      name,
      email,
      password,
    };

    console.log(payload);

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

    const token = sign({ payload }, process.env.JWT_ACC_ACTIVATE, {
      expiresIn: '20m',
    });
    console.log(token);
    console.log('SEND EMAIL'); //TODO

    return {
      statusCode: 200,
      message: 'Email has been sent, kindly activate your account',
    };
  }

  async activateAccount(registerToken): Promise<RegisterUserResponse> {
    try {
      const user = new UserEntity();
      console.log(registerToken);

      if (registerToken) {
        verify(
          registerToken,
          process.env.JWT_ACC_ACTIVATE,
          function (err, decodedToken) {
            if (err) {
              console.log('Error occurred', err);
              throw new BadRequestException('Incorrect or Expired link');
            }
            const { name, email, password } = decodedToken.payload;
            console.log(name, email, password);
            user.name = name;
            user.email = email;
            user.password = password;
          },
        );
      } else {
        throw new BadRequestException('Something went wrong');
      }

      console.log('User', user);
      const isUserExist = await this.getUserByEmail(user.email);
      console.log('isUserExist', isUserExist);

      if (isUserExist) {
        throw new BadRequestException('This user already exist in database');
      }

      // throw new Error('cant write user in db');
      await user.save();
      return {
        statusCode: 200,
        message: 'Account has been activated',
      };
    } catch (err) {
      console.log('Error in signup while account activation: ', err);
      throw new BadRequestException('Error activating account');
    }
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
