import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AnswerTemplateService } from './answer-template/answer-template.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private answerTemplateService: AnswerTemplateService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //TODO Delete after tests
  @Get('/test')
  Test() {
    return this.answerTemplateService.createDefaultTemplatesAndAnswersForRegisterUser();
  }
}
