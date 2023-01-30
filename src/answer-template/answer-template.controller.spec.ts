import { Test, TestingModule } from '@nestjs/testing';
import { AnswerTemplateController } from './answer-template.controller';

describe('AnswerTemplateController', () => {
  let controller: AnswerTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerTemplateController],
    }).compile();

    controller = module.get<AnswerTemplateController>(AnswerTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
