import { ApiProperty } from '@nestjs/swagger';

export class AnswerTemplateNotExistExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example: 'The template with this id: id does not exist',
  })
  message: string;
}

export class NoChangesExceptionResDto {
  @ApiProperty({ description: 'This is real possible status', example: 400 })
  status: number;

  @ApiProperty({
    description: 'This is real possible message',
    example:
      'You have not made any changes to the template, the modification has not been uploaded to the server',
  })
  message: string;
}
