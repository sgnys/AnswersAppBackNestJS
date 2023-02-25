import { ApiProperty } from '@nestjs/swagger';
import { RegisterUserResponse } from 'types';

export class ConfirmPasswordExceptionResDto implements RegisterUserResponse {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'Password and confirm password must be equal',
  })
  message: string;
}

export class PatternPasswordExceptionResDto implements RegisterUserResponse {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example:
      'Password and confirm password should have 1 upper case, lower case letter along with a number and special character',
  })
  message: string;
}

export class NoSentEmailExceptionResDto implements RegisterUserResponse {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'Email has not been sent',
  })
  message: string;
}

export class UserExistExceptionResDto implements RegisterUserResponse {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'This user already exist in database',
  })
  message: string;
}
