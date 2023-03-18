import { AnswerEntity } from '../../src/answer/answer.entity';
import { Template } from '../template';

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

export type CreateAnswerRes = AnswerEntity;

export interface CreateAnswerReq {
  text: string;
  category: CategoryCreateAnswer;
  template: Template | null;
}

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
