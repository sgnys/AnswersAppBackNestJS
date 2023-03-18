import { AnswerIds } from 'types';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AnswerIdsReqDto implements AnswerIds {
  @ApiProperty({
    description: 'List of answer ids',
    example: [
      'f90dfa08-5f8f-46ad-a52b-f10be110231f',
      'db9ebc9b-8f2f-4f4f-abdd-a345aad5ee59',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
