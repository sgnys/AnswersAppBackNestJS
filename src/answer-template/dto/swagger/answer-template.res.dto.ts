import { OmitType } from '@nestjs/swagger';
import { AnswerTemplateEntity } from 'src/answer-template/answer-template.entity';

export class AnswerTemplateResDto extends OmitType(AnswerTemplateEntity, [
  'user',
] as const) {}
