import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthLoginReqDto } from 'src/auth/dto/auth-login-req.dto';
import { UserLoginReg, UserLoginRes, UserRoles } from 'types';
import { Roles } from '../decorators/roles.decorator';
import { UserObj } from 'src/decorators/user-object.decorator';
import { UserEntity } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthLoginResDto } from './dto/auth-login-res.dto';

@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  schema: { example: { status: 500, message: 'Please try later.' } },
})
@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description:
      'Returns User data in Response. Swagger UI does not support cookie authenticated. After correct login, copy the JWT token from BE, to use it for authorization. ',
    type: AuthLoginResDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid login data!',
    schema: { example: { status: 400, message: 'Invalid login data!' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: { status: 401, message: 'User cannot register. Try again!' },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: AuthLoginReqDto })
  login(
    @Body() loginDto: UserLoginReg,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<UserLoginRes> {
    console.log(req.user);
    console.log(loginDto);
    return this.authService.login(loginDto, res);
  }

  @ApiSecurity('api_key')
  @ApiOkResponse({
    description: 'Successful logout',
    schema: { example: { status: 200, message: 'Logout was successful' } },
  })
  @ApiBadRequestResponse({
    description: 'Logout error',
    schema: { example: { status: 400, message: 'Failed to log out' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: { example: { status: 401, message: 'Unauthorized' } },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  logout(@UserObj() user: UserEntity, @Res() res: Response) {
    return this.authService.logout(user, res);
  }

  //TODO delete this method after tests
  @UseGuards(JwtAuthGuard)
  @Get('testPathForJwtAuthGuard')
  async testPathForJwtAuthGuard(@Req() req: Request): Promise<any> {
    return req.user;
  }

  //TODO delete this method after tests
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  @Get('testPathForRolesGuard')
  async testPathForRolesGuard(@Req() req: Request): Promise<any> {
    return req.user;
  }
}
