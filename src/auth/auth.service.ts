import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { UserService } from '../user/user.service';
import { hashPwd } from '../utils/hash-pwd';
import { UserEntity } from '../user/user.entity';
import { sanitizeUser } from '../utils/sanitize-user';
import { stringToBoolean } from '../utils/string-to-boolean';
import { UserLoginReg, UserLoginRes } from 'types';

export interface JwtPayload {
  tokenId: string;
}

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  private oneDay = 1000 * 60 * 60 * 12;

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { tokenId: currentTokenId };
    const expiresIn = this.oneDay;
    const accessToken = sign(payload, process.env.JWT_SECRET, { expiresIn });
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: UserEntity): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await UserEntity.findOne({
        where: { currentTokenId: token },
      });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();

    return token;
  }

  async validateUserCreds(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    console.log(user, 'in validateUserCreds');

    if (!user) throw new BadRequestException('Invalid login data!');

    if (!(user.password === hashPwd(password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(loginDto: UserLoginReg, res: Response): Promise<UserLoginRes> {
    console.log(loginDto);
    try {
      const user = await UserEntity.findOne({
        where: {
          email: loginDto.email,
          password: hashPwd(loginDto.password),
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid login data!');
      }
      // throw new Error('some error occurred');
      const token = this.createToken(await this.generateToken(user));
      console.log(this.oneDay);
      console.log(token);
      res
        .cookie('jwt', token.accessToken, {
          secure: stringToBoolean(process.env.COOKIE_SECURE),
          domain: process.env.DOMAIN,
          httpOnly: true,
          maxAge: this.oneDay,
        })
        .json(sanitizeUser(user));
      return sanitizeUser(user);
    } catch (e) {
      console.log('Failed to log in', e);
      throw new UnauthorizedException('User cannot register. Try again!');
    }
  }

  async logout(user: UserEntity, res: Response) {
    try {
      // throw new Error('some error for tests');
      user.currentTokenId = null;
      await user.save();

      res.clearCookie('jwt', {
        secure: stringToBoolean(process.env.COOKIE_SECURE),
        domain: process.env.DOMAIN,
        httpOnly: true,
      });
      return res.json({ statusCode: 200, message: 'Logout was successful' });
    } catch (e) {
      console.log('Failed to log out');
      throw new BadRequestException('Failed to log out');
    }
  }
}
