import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { AnswerUpdateDto } from './dto/answer-update.dto';
import {
  AnswerIds,
  AnswerRes,
  CategoryAnswer,
  CategoryCreateAnswer,
  CreateAnswerRes,
} from 'types';
import { AnswerTemplateService } from '../answer-template/answer-template.service';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AnswerCreateReqDto } from './dto/answer-create.req.dto';

@Injectable()
export class AnswerService {
  constructor(
    private dataSource: DataSource,
    private answerTemplateService: AnswerTemplateService,
    private userService: UserService,
  ) {}

  async getAll(): Promise<AnswerRes[]> {
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

  async getAnswers(user: UserEntity): Promise<AnswerRes[]> {
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

  async create(
    user: UserEntity,
    answer: AnswerCreateReqDto,
  ): Promise<CreateAnswerRes> {
    const newAnswer = await new AnswerEntity();

    const { id } = user;

    console.log(answer.template);

    const template = answer.template
      ? await this.answerTemplateService.getTemplateByName(answer.template)
      : null;

    newAnswer.text = answer.text;
    newAnswer.category = answer.category;
    newAnswer.template = template?.name;

    await newAnswer.save();

    newAnswer.answerTemplate = template;

    await newAnswer.save();

    const oneUser = await this.userService.getUserById(id);

    newAnswer.user = oneUser;

    console.log(oneUser);

    await newAnswer.save();

    return await this.getAnswerById(user, newAnswer.id);
  }

  async update(
    user: UserEntity,
    id: string,
    data: AnswerUpdateDto,
  ): Promise<AnswerRes> {
    const answer = await this.getAnswerById(user, id);
    console.log(answer);

    if (answer === null) {
      throw new BadRequestException(
        'Cannot edit an answer that does not exist',
      );
    }

    console.log(data);

    if (!data.template) {
      answer.template = null;
      answer.category = data.category;
      answer.text = data.text;

      answer.answerTemplate = null;

      await answer.save();

      return answer;
    }

    answer.template = data.template;
    answer.category = data.category;
    answer.text = data.text;

    const template = await this.answerTemplateService.getTemplateByName(
      data.template,
    );

    answer.answerTemplate = template;

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

  async getAnswerById(user: UserEntity, id: string): Promise<AnswerEntity> {
    const { id: userId } = user;

    const selected = ['answerEntity'];

    const answer = await this.dataSource
      .createQueryBuilder()
      .select(selected)
      .from(AnswerEntity, 'answerEntity')
      .leftJoin('answerEntity.user', 'user')
      .leftJoinAndSelect('answerEntity.answerTemplate', 'answerTemplate')
      .where('answerEntity.id = :id AND user.id = :userId', { id, userId })
      .getOne();

    console.log(answer);

    if (!answer) {
      throw new BadRequestException(
        `The answer with this id: ${id} does not exist`,
      );
    }

    return answer;
  }

  async getAllSortedByCategory(
    user: UserEntity,
    category: CategoryCreateAnswer | CategoryAnswer,
  ): Promise<AnswerRes[]> {
    console.log(category);

    const { id } = user;
    const selected = ['answerEntity'];

    if (
      category === CategoryCreateAnswer.IT ||
      category === CategoryCreateAnswer.PREPAID ||
      category === CategoryCreateAnswer.TELCO ||
      category === CategoryCreateAnswer.OTHER
    ) {
      const answers = await this.dataSource
        .createQueryBuilder()
        .select(selected)
        .from(AnswerEntity, 'answerEntity')
        .leftJoin('answerEntity.user', 'user')
        .leftJoinAndSelect('answerEntity.answerTemplate', 'answerTemplate')
        .where('user.id = :id AND answerEntity.category = :category', {
          id,
          category,
        })
        .orderBy('answerEntity.createdAt', 'DESC')
        .getMany();

      return answers;
    } else if (category === CategoryAnswer.ALL) {
      const answers = await this.dataSource
        .createQueryBuilder()
        .select(selected)
        .from(AnswerEntity, 'answerEntity')
        .leftJoin('answerEntity.user', 'user')
        .leftJoinAndSelect('answerEntity.answerTemplate', 'answerTemplate')
        .where('user.id = :id ', {
          id,
        })
        .orderBy('answerEntity.createdAt', 'DESC')
        .getMany();

      return answers;
    } else if (category === CategoryAnswer.MOST_COPIED) {
      const answers = await this.dataSource
        .createQueryBuilder()
        .select(selected)
        .from(AnswerEntity, 'answerEntity')
        .leftJoin('answerEntity.user', 'user')
        .leftJoinAndSelect('answerEntity.answerTemplate', 'answerTemplate')
        .where('user.id = :id ', {
          id,
        })
        .orderBy('answerEntity.copyBtnCount', 'DESC')
        .getMany();

      return answers;
    } else {
      throw new BadRequestException('No answer category was marked');
    }
  }

  async delete(user: UserEntity, id: string) {
    const answer = await this.getAnswerById(user, id);
    console.log(answer);
    await answer.remove();

    return {
      codeStatus: 200,
      message: `The answer has been removed from the list`,
    };
  }

  async deleteSelected(user: UserEntity, body: AnswerIds) {
    console.log(body.ids);
    const { id } = user;
    const { ids } = body;

    const answers = await this.dataSource
      .createQueryBuilder()
      .select('answerEntity')
      .from(AnswerEntity, 'answerEntity')
      .leftJoin('answerEntity.user', 'user')
      .where('user.id = :id AND answerEntity.id IN (:...ids)', {
        id,
        ids,
      })
      .getMany();

    const result = await AnswerEntity.remove(answers);
    console.log(result);

    return {
      codeStatus: 200,
      message: `Selected answers has been removed from the list`,
    };
  }
}
