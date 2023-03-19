import { ApiProperty } from '@nestjs/swagger';

export class UserTokenNotExistExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'User with this token does not exist',
  })
  message: string;
}

export class ResetPasswordExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 401 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'Reset password error',
  })
  message: string;
}

export class ResetPasswordLinkExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 401 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'Reset password link error',
  })
  message: string;
}
