import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { RegisterUserResponse } from '../../types';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  register(
    @Body() userRegister: UserRegisterRequestDto,
  ): Promise<RegisterUserResponse> {
    return this.userService.register(userRegister);
  }

  @Post('/email-activate')
  activateAccount(
    @Body('registerToken') registerToken: string,
  ): Promise<RegisterUserResponse> {
    return this.userService.activateAccount(registerToken);
  }
}
