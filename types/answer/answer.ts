import { AnswerEntity } from '../../src/answer/answer.entity';
import { AnswerTemplateRes, Template } from '../template';
import { AnswerUserRes } from '../user';

export enum CategoryCreateAnswer {
  IT = 'it',
  TELCO = 'telco',
  PREPAID = 'prepaid',
  OTHER = 'other',
}

// export type CategoryAnswer = CategoryCreateAnswer | 'all' | 'most-copied';

export enum CategoryAnswer {
  IT = 'it',
  TELCO = 'telco',
  PREPAID = 'prepaid',
  OTHER = 'other',
  ALL = 'all',
  MOST_COPIED = 'most-copied',
}

export type CreateAnswerResponse = AnswerEntity;

export interface AnswerIds {
  ids: string[];
}

export interface AnswerRes {
  id: string;
  text: string;
  category: CategoryCreateAnswer;
  copyBtnCount: number;
  template: Template;
  createdAt: Date;
  updatedAt: Date;
}
