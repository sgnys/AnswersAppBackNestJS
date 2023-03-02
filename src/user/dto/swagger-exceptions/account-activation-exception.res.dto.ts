import { ApiProperty } from '@nestjs/swagger';

export class IncorrectOrExpiredLinkExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'Incorrect or Expired link',
  })
  message: string;
}

export class NoSentRegisterTokenExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'The token has not been sent',
  })
  message: string;
}

export class UserAlreadyExistExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'This user already exist in database',
  })
  message: string;
}

export class ActivatingAccountExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'Error activating account',
  })
  message: string;
}
