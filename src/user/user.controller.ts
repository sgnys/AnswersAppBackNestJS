import { Body, Controller, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { RegisterUserResponse } from '../../types';
import { ResetPasswordRequestDto } from './dto/reset-password.req.dto';

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

  @Put('/forgot-password')
  forgotPassword(@Body('email') email: string): Promise<RegisterUserResponse> {
    return this.userService.forgotPassword(email);
  }

  @Put('/reset-password')
  resetPassword(
    @Body() resetPass: ResetPasswordRequestDto,
  ): Promise<RegisterUserResponse> {
    return this.userService.resetPassword(resetPass);
  }
}
