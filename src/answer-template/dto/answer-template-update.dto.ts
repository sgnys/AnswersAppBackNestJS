import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerTemplateUpdateDto {
  @ApiProperty({
    description: 'First paragraph of template',
    minLength: 3,
    maxLength: 200,
    example: 'Dzień Dobry',
  })
  @IsNotEmpty()
  @Length(3, 200)
  firstParagraph: string;

  @ApiProperty({
    description: 'Last paragraph of template',
    minLength: 3,
    maxLength: 300,
    example: 'Pozdrawiamy',
  })
  @IsNotEmpty()
  @Length(3, 300)
  lastParagraph: string;
}
