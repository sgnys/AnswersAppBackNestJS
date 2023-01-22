import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { AnswerCreateDto } from './dto/answer-create.dto';
import { AnswerUpdateDto } from './dto/answer-update.dto';
import { AnswerIds, CategoryAnswer, CategoryCreateAnswer } from 'types';

@Injectable()
export class AnswerService {
  constructor(private dataSource: DataSource) {}

  async getAll(): Promise<AnswerEntity[]> {
    return await AnswerEntity.find();
  }

  async create(answer: AnswerCreateDto): Promise<AnswerEntity> {
    const newItem = await new AnswerEntity();

    console.log(newItem.template);

    newItem.text = answer.text;
    newItem.category = answer.category;
    newItem.template = answer.template;

    await newItem.save();

    return newItem;
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
