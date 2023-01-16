import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { CategoryCreateAnswer, Template } from 'types';

export class CreateAnswerDto {
  @IsNotEmpty()
  @Length(3, 3000)
  text: string;

  @IsNotEmpty()
  @IsEnum(CategoryCreateAnswer)
  category: CategoryCreateAnswer;

  @IsOptional()
  @IsEnum(Template)
  template: Template | null;
}
