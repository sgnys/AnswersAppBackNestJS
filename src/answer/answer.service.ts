import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { AnswerCreateDto } from './dto/answer-create.dto';
import { AnswerUpdateDto } from './dto/answer-update.dto';
import { AnswerIds, CategoryAnswer, CategoryCreateAnswer } from 'types';
import { AnswerTemplateService } from '../answer-template/answer-template.service';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AnswerService {
  constructor(
    private dataSource: DataSource,
    private answerTemplateService: AnswerTemplateService,
  ) {}

  async getAll(): Promise<AnswerEntity[]> {
    const selected = ['answerEntity', 'user.id', 'user.name', 'user.email'];

    const answers = await this.dataSource
      .createQueryBuilder()
      .select(selected)
      .from(AnswerEntity, 'answerEntity')
      .leftJoin('answerEntity.user', 'user')
      .leftJoinAndSelect('answerEntity.answerTemplate', 'answerTemplate')
      .orderBy('user.email')
      .getMany();

    return answers;
  }

  async getAnswers(user: UserEntity): Promise<AnswerEntity[]> {
    console.log(user);
    const { id } = user;

    const selected = ['answerEntity'];

    const answers = await this.dataSource
      .createQueryBuilder()
      .select(selected)
      .from(AnswerEntity, 'answerEntity')
      .leftJoin('answerEntity.user', 'user')
      .leftJoinAndSelect('answerEntity.answerTemplate', 'answerTemplate')
      .where('answerEntity.user = :id', { id })
      .orderBy('answerEntity.createdAt', 'DESC')
      .getMany();

    return answers;
  }

  async create(answer: AnswerCreateDto): Promise<AnswerEntity> {
    const newAnswer = await new AnswerEntity();

    console.log(answer.template);

    newAnswer.text = answer.text;
    newAnswer.category = answer.category;
    newAnswer.template = answer.template;

    await newAnswer.save();

    if (answer.template) {
      const template = await this.answerTemplateService.getTemplateByName(
        answer.template,
      );

      newAnswer.answerTemplate = template;

      await newAnswer.save();
    }

    return newAnswer;
  }

  async update(id: string, data: AnswerUpdateDto): Promise<AnswerEntity> {
    const answer = await this.getAnswerById(id);
    console.log(answer);

    if (answer === null) {
      throw new BadRequestException(
        'Cannot edit an answer that does not exist',
      );
    }

    console.log(data);

    answer.template = data.template;
    answer.category = data.category;
    answer.text = data.text;

    await answer.save();

    return answer;
  }

  async updateCopyCount(id: string): Promise<number> {
    const results = await this.dataSource
      .createQueryBuilder()
      .update(AnswerEntity)
      .set({
        copyBtnCount: () => 'copyBtnCount + 1',
      })
      .where('id = :id', { id })
      .execute();

    console.log(results);

    const { affected } = results;

    return affected;
  }

  async getAnswerById(id: string): Promise<AnswerEntity | undefined> {
    return await AnswerEntity.findOne({
      where: { id },
    });
  }

  async getAllSortedByCategory(
    category: CategoryAnswer,
  ): Promise<AnswerEntity[]> {
    console.log(category);
    if (
      category === CategoryCreateAnswer.IT ||
      category === CategoryCreateAnswer.PREPAID ||
      category === CategoryCreateAnswer.TELCO ||
      category === CategoryCreateAnswer.OTHER
    ) {
      return await AnswerEntity.find({
        where: {
          category: category,
        },
      });
    } else if (category === 'all') {
      return await AnswerEntity.find();
    } else if (category === 'most-copied') {
      return await AnswerEntity.find({
        order: {
          copyBtnCount: 'DESC',
        },
      });
    } else {
      throw new BadRequestException('No answer category was marked');
    }
  }

  async delete(id: string) {
    await AnswerEntity.delete(id);
  }

  async deleteSelected(body: AnswerIds): Promise<number> {
    console.log(body.ids);
    const { ids } = body;

    const results = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(AnswerEntity)
      .where('answer_entity.id IN (:...ids)', {
        ids,
      })
      .execute();

    console.log(results.affected);

    return results.affected;
  }
}
