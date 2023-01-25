import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AnswerTemplateService } from './answer-template.service';
import { AnswerTemplateEntity } from './answer-template.entity';
import { AnswerTemplateUpdateDto } from './dto/answer-template-update.dto';

@Controller('api/answer-template')
export class AnswerTemplateController {
  constructor(private answerTemplateService: AnswerTemplateService) {}

  @Get()
  getAll(): Promise<AnswerTemplateEntity[]> {
    return this.answerTemplateService.getAll();
  }

  @Get('/:id')
  getOne(@Param('id') id: string): Promise<AnswerTemplateEntity> {
    return this.answerTemplateService.getTemplateById(id);
  }

  @Put('/:id')
  update(
    @Body() body: AnswerTemplateUpdateDto,
    @Param('id') id: string,
  ): Promise<AnswerTemplateEntity> {
    return this.answerTemplateService.updateTemplate(id, body);
  }
}
