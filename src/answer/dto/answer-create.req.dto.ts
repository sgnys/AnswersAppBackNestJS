import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { CategoryCreateAnswer, CreateAnswerReq, Template } from 'types';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerCreateReqDto implements CreateAnswerReq {
  @ApiProperty({
    description: 'The main content of answer',
    example: 'Lorem ipsum, Lorem ipsum....',
    minLength: 3,
    maxLength: 3000,
  })
  @IsNotEmpty()
  @Length(3, 3000)
  text: string;

  @ApiProperty({
    description: 'Category of answer',
    enum: CategoryCreateAnswer,
    example: 'telco',
  })
  @IsNotEmpty()
  @IsEnum(CategoryCreateAnswer)
  category: CategoryCreateAnswer;

  @ApiProperty({
    description: 'Name of answer template',
    enum: Template,
    example: 'customer',
    nullable: true,
  })
  @IsEnum(Template)
  template: Template | null;
}
