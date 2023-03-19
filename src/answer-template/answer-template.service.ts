import { BadRequestException, Injectable } from '@nestjs/common';
import { AnswerTemplateEntity } from './answer-template.entity';
import { AnswerTemplateUpdateDto } from './dto/answer-template-update.dto';
import { DEFAULT_ANSWERS, DEFAULT_TEMPLATES } from '../utils/constants';
import { AnswerEntity } from '../answer/answer.entity';
import { AnswerTemplateRes, Template } from 'types';
import { DataSource } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AnswerTemplateService {
  constructor(private dataSource: DataSource) {}

  async getAll(): Promise<AnswerTemplateRes[]> {
    const selected = [
      'AnswerTemplateEntity',
      'user.id',
      'user.email',
      'user.name',
    ];

    const templates = await this.dataSource
      .createQueryBuilder()
      .select(selected)
      .from(AnswerTemplateEntity, 'AnswerTemplateEntity')
      .leftJoin('AnswerTemplateEntity.user', 'user')
      .orderBy('user.email')
      .getMany();

    return templates;
  }

  async getTemplates(user: UserEntity): Promise<AnswerTemplateRes[]> {
    console.log(user);
    const { id } = user;

    const selected = ['AnswerTemplateEntity'];

    const templates = await this.dataSource
      .createQueryBuilder()
      .select(selected)
      .from(AnswerTemplateEntity, 'AnswerTemplateEntity')
      .leftJoin('AnswerTemplateEntity.user', 'user')
      .where('AnswerTemplateEntity.user = :id', { id })
      .getMany();

    return templates;
  }

  async getTemplateById(
    user: UserEntity,
    id: string,
  ): Promise<AnswerTemplateEntity> {
    const { id: userId } = user;

    const selected = ['AnswerTemplateEntity'];

    const template = await this.dataSource
      .createQueryBuilder()
      .select(selected)
      .from(AnswerTemplateEntity, 'AnswerTemplateEntity')
      .leftJoin('AnswerTemplateEntity.user', 'user')
      .where('AnswerTemplateEntity.id = :id AND user.id = :userId', {
        id,
        userId,
      })
      .getOne();

    console.log(template);

    if (!template) {
      throw new BadRequestException(
        `The template with this id: ${id} does not exist`,
      );
    }

    return template;
  }

  async getTemplateByName(name: Template): Promise<AnswerTemplateEntity> {
    return AnswerTemplateEntity.findOne({
      where: { name },
    });
  }

  async updateTemplate(
    user: UserEntity,
    id: string,
    data: AnswerTemplateUpdateDto,
  ): Promise<AnswerTemplateRes> {
    const template = await this.getTemplateById(user, id);
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
