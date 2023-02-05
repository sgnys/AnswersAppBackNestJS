import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerCreateDto } from './dto/answer-create.dto';
import { AnswerEntity } from './answer.entity';
import { AnswerUpdateDto } from './dto/answer-update.dto';
import { AnswerIds, CategoryAnswer, UserRoles } from 'types';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UserObj } from '../decorators/user-object.decorator';
import { UserEntity } from '../user/user.entity';

@Controller('api/answer')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  getAll(): Promise<AnswerEntity[]> {
    return this.answerService.getAll();
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getUserAnswers(@UserObj() user: UserEntity): Promise<AnswerEntity[]> {
    return this.answerService.getAnswers(user);
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
