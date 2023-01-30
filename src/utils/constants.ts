import { CategoryCreateAnswer, Template } from 'types';

const PASSWORD_RULE =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const REGEX = {
  PASSWORD_RULE,
};

export const DEFAULT_TEMPLATES = {
  CUSTOMER: {
    NAME: Template.CUSTOMER,
    FIRST_PARAGRAPH: 'Dzień Dobry',
    LAST_PARAGRAPH: 'Pozdrawiamy',
  },
  CONSULTANT: {
    NAME: Template.CONSULTANT,
    FIRST_PARAGRAPH: 'Cześć',
    LAST_PARAGRAPH: 'Pozdrawiam',
  },
};

export const DEFAULT_ANSWERS = {
  CUSTOMER: {
    CONTENT: 'Przykładowa odpowiedź do Klienta',
    CATEGORY: CategoryCreateAnswer.OTHER,
    TEMPLATE: Template.CUSTOMER,
  },
  CONSULTANT: {
    CONTENT: 'Przykładowa odpowiedź do Konsultanta',
    CATEGORY: CategoryCreateAnswer.OTHER,
    TEMPLATE: Template.CONSULTANT,
  },
};
