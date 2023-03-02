import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoles } from 'types';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginResDto {
  @ApiProperty({
    description: 'User id',
    example: '100',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'UserRoles: 1-ADMIN, 2-MEMBER',
    example: 2,
    enum: UserRoles,
  })
  @IsEnum(UserRoles)
  role: UserRoles;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'Sławek',
  })
  @IsNotEmpty()
  name: string;
}
