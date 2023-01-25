import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerCreateDto } from './dto/answer-create.dto';
import { AnswerEntity } from './answer.entity';
import { AnswerUpdateDto } from './dto/answer-update.dto';
import { AnswerIds, CategoryAnswer } from 'types';

@Controller('api/answer')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Get('/')
  getAll(): Promise<AnswerEntity[]> {
    return this.answerService.getAll();
  }

  @Get('/:id')
  getOne(@Param('id') id: string): Promise<AnswerEntity> {
    return this.answerService.getAnswerById(id);
  }

  @Get('/sort/:category')
  getSorted(
    @Param('category') category: CategoryAnswer,
  ): Promise<AnswerEntity[]> {
    return this.answerService.getAllSortedByCategory(category);
  }

  @Post('/')
  create(@Body() body: AnswerCreateDto): Promise<AnswerEntity> {
    return this.answerService.create(body);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() body: AnswerUpdateDto,
  ): Promise<AnswerEntity> {
    return this.answerService.update(id, body);
  }

  @Put('/count/:id')
  updateCount(@Param('id') id: string): Promise<number> {
    return this.answerService.updateCopyCount(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.answerService.delete(id);
  }

  @Delete('/selected')
  deleteMany(@Body() body: AnswerIds): Promise<number> {
    console.log(body);
    return this.answerService.deleteSelected(body);
  }
}
