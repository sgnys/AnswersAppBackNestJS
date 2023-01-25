import { BadRequestException, Injectable } from '@nestjs/common';
import { AnswerTemplateEntity } from './answer-template.entity';
import { AnswerTemplateUpdateDto } from './dto/answer-template-update.dto';
import { DEFAULT_TEMPLATES } from '../utils/constants';

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

  async createDefaultTemplatesForRegisterUser() {
    const customerTemplate = await new AnswerTemplateEntity();

    customerTemplate.name = DEFAULT_TEMPLATES.CUSTOMER.NAME;

    customerTemplate.firstParagraph =
      DEFAULT_TEMPLATES.CUSTOMER.FIRST_PARAGRAPH;

    customerTemplate.lastParagraph = DEFAULT_TEMPLATES.CUSTOMER.LAST_PARAGRAPH;

    await customerTemplate.save();

    const consultantTemplate = await new AnswerTemplateEntity();

    consultantTemplate.name = DEFAULT_TEMPLATES.CONSULTANT.NAME;

    consultantTemplate.firstParagraph =
      DEFAULT_TEMPLATES.CONSULTANT.FIRST_PARAGRAPH;

    consultantTemplate.lastParagraph =
      DEFAULT_TEMPLATES.CONSULTANT.LAST_PARAGRAPH;

    await consultantTemplate.save();
  }
}
