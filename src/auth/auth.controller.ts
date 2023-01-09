import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

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
}
