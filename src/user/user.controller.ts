import { Body, Controller, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterReqDto } from './dto/user-register.req.dto';
import {
  ActivateUserResponse,
  RegisterUserResponse,
  UserRegister,
} from 'types';
import { ResetPasswordRequestDto } from './dto/reset-password.req.dto';
import {
  ConfirmPasswordExceptionResDto,
  NoSentEmailExceptionResDto,
  PatternPasswordExceptionResDto,
  UserExistExceptionResDto,
} from './dto/swagger-exceptions/register-exception.res.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  refs,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiInternalServerErrorResponse({ description: 'Please try later.' })
@ApiExtraModels(
  PatternPasswordExceptionResDto,
  ConfirmPasswordExceptionResDto,
  UserExistExceptionResDto,
  NoSentEmailExceptionResDto,
)
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({
    description: 'Email has been sent, kindly activate your account',
    status: 201,
  })
  @ApiBadRequestResponse({
    description: 'Schemas of exceptions',
    schema: {
      anyOf: refs(
        PatternPasswordExceptionResDto,
        ConfirmPasswordExceptionResDto,
        UserExistExceptionResDto,
        NoSentEmailExceptionResDto,
      ),
    },
  })
  @Post('/register')
  @ApiBody({ type: UserRegisterReqDto })
  register(
    @Body()
    userRegister: UserRegister,
  ): Promise<RegisterUserResponse> {
    return this.userService.register(userRegister);
  }

  @Post('/email-activate')
  activateAccount(
    @Body('registerToken') registerToken: string,
  ): Promise<ActivateUserResponse> {
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
