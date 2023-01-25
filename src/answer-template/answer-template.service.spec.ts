import { Test, TestingModule } from '@nestjs/testing';
import { AnswerTemplateService } from './answer-template.service';

describe('AnswerTemplateService', () => {
  let service: AnswerTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerTemplateService],
    }).compile();

    service = module.get<AnswerTemplateService>(AnswerTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
