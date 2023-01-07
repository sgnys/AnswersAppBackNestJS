import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { hashPwd } from '../utils/hash-pwd';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUserCreds(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    console.log(user, 'in validateUserCreds');

    if (!user) throw new BadRequestException();

    if (!(user.password === hashPwd(password))) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
