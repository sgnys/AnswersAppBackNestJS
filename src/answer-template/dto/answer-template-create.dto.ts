import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Template } from 'types';

export class AnswerTemplateCreateDto {
  @IsNotEmpty()
  @IsEnum(Template)
  name: Template;

  @IsNotEmpty()
  @Length(3, 200)
  firstParagraph: string;

  @IsNotEmpty()
  @Length(3, 300)
  lastParagraph: string;
}
