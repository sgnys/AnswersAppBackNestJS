import { ApiProperty } from '@nestjs/swagger';

export class AnswerNotExistExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'The answer with this id: id does not exist',
  })
  message: string;
}
