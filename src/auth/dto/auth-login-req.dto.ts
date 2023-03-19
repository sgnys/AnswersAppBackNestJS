import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserLoginReg } from 'types';

export class AuthLoginReqDto implements UserLoginReg {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password in plain text',
    example: 'Password@123',
  })
  @IsNotEmpty()
  password: string;
}
