import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterReqDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Pablo',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'ExamplePassword1#',
    pattern: '/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
    minLength: 8,
    maxLength: 24,
  })
  @IsNotEmpty()
  @Length(8, 24)
  password: string;

  @ApiProperty({
    description: 'Confirmation password of the user',
    example: 'ExamplePassword1#',
    pattern: '/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
    minLength: 8,
    maxLength: 24,
  })
  @IsNotEmpty()
  @Length(8, 24)
  confirm: string;
}
