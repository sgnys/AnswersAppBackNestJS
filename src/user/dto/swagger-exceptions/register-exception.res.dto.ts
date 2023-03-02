import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPasswordExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'Password and confirm password must be equal',
  })
  message: string;
}

export class PatternPasswordExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example:
      'Password and confirm password should have 1 upper case, lower case letter along with a number and special character',
  })
  message: string;
}

export class NoSentEmailExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'Email has not been sent',
  })
  message: string;
}

export class UserExistExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'This user already exist in database',
  })
  message: string;
}
