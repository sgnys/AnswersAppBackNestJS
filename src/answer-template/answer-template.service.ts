import { BadRequestException, Injectable } from '@nestjs/common';
import { AnswerTemplateEntity } from './answer-template.entity';
import { AnswerTemplateUpdateDto } from './dto/answer-template-update.dto';
import { DEFAULT_ANSWERS, DEFAULT_TEMPLATES } from '../utils/constants';
import { AnswerEntity } from '../answer/answer.entity';
import { Template } from 'types';

@Injectable()
export class AnswerTemplateService {
  async getAll(): Promise<AnswerTemplateEntity[]> {
    return AnswerTemplateEntity.find();
  }

  async getTemplateById(id: string): Promise<AnswerTemplateEntity> {
    return AnswerTemplateEntity.findOne({
      where: { id },
    });
  }

  async getTemplateByName(name: Template): Promise<AnswerTemplateEntity> {
    return AnswerTemplateEntity.findOne({
      where: { name },
    });
  }

  async updateTemplate(
    id: string,
    data: AnswerTemplateUpdateDto,
  ): Promise<AnswerTemplateEntity> {
    const template = await this.getTemplateById(id);
    console.log(template);

    if (template === null) {
      throw new BadRequestException(
        'Cannot edit an template that does not exist',
      );
    }

    console.log(data);

    if (
      template.firstParagraph === data.firstParagraph &&
      template.lastParagraph === data.lastParagraph
    ) {
      throw new BadRequestException(
        'You have not made any changes to the template, the modification has not been uploaded to the server',
      );
    }

    template.firstParagraph = data.firstParagraph;
    template.lastParagraph = data.lastParagraph;

    await template.save();

    return template;
  }

  async createDefaultTemplatesAndAnswersForRegisterUser() {
    const customerTemplate = await new AnswerTemplateEntity();

    customerTemplate.name = DEFAULT_TEMPLATES.CUSTOMER.NAME;

    customerTemplate.firstParagraph =
      DEFAULT_TEMPLATES.CUSTOMER.FIRST_PARAGRAPH;

    customerTemplate.lastParagraph = DEFAULT_TEMPLATES.CUSTOMER.LAST_PARAGRAPH;

    const customerAnswer = await new AnswerEntity();

    customerAnswer.text = DEFAULT_ANSWERS.CUSTOMER.CONTENT;
    customerAnswer.category = DEFAULT_ANSWERS.CUSTOMER.CATEGORY;
    customerAnswer.template = DEFAULT_ANSWERS.CUSTOMER.TEMPLATE;

    await customerTemplate.save();
    await customerAnswer.save();

    customerAnswer.answerTemplate = customerTemplate;

    await customerAnswer.save();

    const consultantTemplate = await new AnswerTemplateEntity();

    consultantTemplate.name = DEFAULT_TEMPLATES.CONSULTANT.NAME;

    consultantTemplate.firstParagraph =
      DEFAULT_TEMPLATES.CONSULTANT.FIRST_PARAGRAPH;

    consultantTemplate.lastParagraph =
      DEFAULT_TEMPLATES.CONSULTANT.LAST_PARAGRAPH;

    const consultantAnswer = await new AnswerEntity();

    consultantAnswer.text = DEFAULT_ANSWERS.CONSULTANT.CONTENT;
    consultantAnswer.category = DEFAULT_ANSWERS.CONSULTANT.CATEGORY;
    consultantAnswer.template = DEFAULT_ANSWERS.CONSULTANT.TEMPLATE;

    await consultantTemplate.save();
    await consultantAnswer.save();

    consultantAnswer.answerTemplate = consultantTemplate;

    await consultantAnswer.save();

    return {
      consultantTemplate,
      consultantAnswer,
      customerTemplate,
      customerAnswer,
    };
  }
}
