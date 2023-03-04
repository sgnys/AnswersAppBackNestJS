import { ApiProperty } from '@nestjs/swagger';

export class UserNotExistExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'User with this email does not exist',
  })
  message: string;
}

export class ResetPasswordExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'Reset password link error',
  })
  message: string;
}
