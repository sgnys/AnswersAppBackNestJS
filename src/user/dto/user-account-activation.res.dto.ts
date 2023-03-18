import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserAccountActivationRes, UserRoles } from 'types';

export class UserAccountActivationResDto implements UserAccountActivationRes {
  @ApiProperty({
    description: 'User uuid',
    example: 'c25d3d10-fcea-4103-9539-cf2258d4cbba',
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
