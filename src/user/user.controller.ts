import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterReqDto } from './dto/user-register.req.dto';
import {
  UserAccountActivationRes,
  RegisterUserResponse,
  UserRegisterReq,
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
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { UserAccountActivationResDto } from './dto/user-account-activation.res.dto';
import {
  ActivatingAccountExceptionResDto,
  IncorrectOrExpiredLinkExceptionResDto,
  NoSentRegisterTokenExceptionResDto,
  UserAlreadyExistExceptionResDto,
} from './dto/swagger-exceptions/account-activation-exception.res.dto';
import {
  ResetPasswordExceptionResDto,
  UserNotExistExceptionResDto,
} from './dto/swagger-exceptions/forgot-password-exception.res.dto';

@ApiTags('User')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  schema: { example: { status: 500, message: 'Please try later.' } },
})
@ApiExtraModels(
  PatternPasswordExceptionResDto,
  ConfirmPasswordExceptionResDto,
  UserExistExceptionResDto,
  NoSentEmailExceptionResDto,
  IncorrectOrExpiredLinkExceptionResDto,
  NoSentRegisterTokenExceptionResDto,
  UserAlreadyExistExceptionResDto,
  ActivatingAccountExceptionResDto,
  UserNotExistExceptionResDto,
  ResetPasswordExceptionResDto,
)
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({
    description: 'Ok Response',
    status: 201,
    schema: {
      example: {
        status: 201,
        message: 'Email has been sent, kindly activate your account',
      },
    },
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
    userRegister: UserRegisterReq,
  ): Promise<RegisterUserResponse> {
    return this.userService.register(userRegister);
  }

  @ApiCreatedResponse({
    description: 'Returns User data after logged in',
    type: UserAccountActivationResDto,
  })
  @ApiQuery({
    name: 'registerToken',
    description: 'User registration token valid for 20 minutes ',
  })
  @ApiBadRequestResponse({
    description: 'Schemas of exceptions',
    schema: {
      anyOf: refs(
        IncorrectOrExpiredLinkExceptionResDto,
        NoSentRegisterTokenExceptionResDto,
        UserAlreadyExistExceptionResDto,
        ActivatingAccountExceptionResDto,
      ),
    },
  })
  @Post('/email-activate')
  activateAccount(
    @Query('registerToken') registerToken: string,
  ): Promise<UserAccountActivationRes> {
    console.log('token', registerToken);
    return this.userService.activateAccount(registerToken);
  }

  @ApiResponse({
    description: 'Ok Response',
    status: 200,
    schema: {
      example: {
        status: 200,
        message: 'Email has been sent, kindly activate your account',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Schemas of exceptions',
    schema: {
      anyOf: refs(UserNotExistExceptionResDto, ResetPasswordExceptionResDto),
    },
  })
  @Put('/forgot-password')
  @ApiBody({
    schema: {
      example: {
        email: 'user_email@example.com',
      },
    },
  })
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
