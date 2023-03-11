import { OmitType } from '@nestjs/swagger';
import { AnswerEntity } from 'src/answer/answer.entity';

export class AnswerResDto extends OmitType(AnswerEntity, ['user'] as const) {}
