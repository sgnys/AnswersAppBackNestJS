import { AnswerEntity } from '../../src/answer/answer.entity';

export enum CategoryCreateAnswer {
  IT = 'it',
  TELCO = 'telco',
  PREPAID = 'prepaid',
  OTHER = 'other',
}

export type CategoryAnswer = CategoryCreateAnswer | 'all' | 'most-copied';

export type CreateAnswerResponse = AnswerEntity;
