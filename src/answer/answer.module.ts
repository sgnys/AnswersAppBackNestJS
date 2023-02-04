import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { AnswerTemplateModule } from '../answer-template/answer-template.module';

@Module({
  imports: [AnswerTemplateModule],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
