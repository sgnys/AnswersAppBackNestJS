export enum Template {
  CUSTOMER = 'customer',
  CONSULTANT = 'consultant',
}

export interface AnswerTemplateRes {
  id: string;
  name: Template;
  firstParagraph: string;
  lastParagraph: string;
  updatedAt: Date;
}
