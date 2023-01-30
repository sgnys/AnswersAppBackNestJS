import { IsNotEmpty, Length } from 'class-validator';

export class AnswerTemplateUpdateDto {
  @IsNotEmpty()
  @Length(3, 200)
  firstParagraph: string;

  @IsNotEmpty()
  @Length(3, 300)
  lastParagraph: string;
}
