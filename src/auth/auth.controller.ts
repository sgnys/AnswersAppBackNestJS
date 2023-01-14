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
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'types';
import { Roles } from '../decorators/roles.decorator';
import { UserObj } from 'src/decorators/user-object.decorator';
import { UserEntity } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: AuthLoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    console.log(req.user);
    console.log(loginDto);
    return this.authService.login(loginDto, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@UserObj() user: UserEntity, @Res() res: Response) {
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
