import { Module } from '@nestjs/common';
import { AnswerTemplateController } from './answer-template.controller';
import { AnswerTemplateService } from './answer-template.service';

@Module({
  controllers: [AnswerTemplateController],
  providers: [AnswerTemplateService],
})
export class AnswerTemplateModule {}
