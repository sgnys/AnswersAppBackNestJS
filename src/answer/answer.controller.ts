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
import {
  AnswerIds,
  CategoryAnswer,
  CategoryCreateAnswer,
  UserRoles,
} from 'types';
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
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getUserAnswers(@UserObj() user: UserEntity): Promise<AnswerEntity[]> {
    return this.answerService.getAnswers(user);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getOne(
    @UserObj() user: UserEntity,
    @Param('id') id: string,
  ): Promise<AnswerEntity> {
    return this.answerService.getAnswerById(user, id);
  }

  @Get('/sort/:category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getSorted(
    @UserObj() user: UserEntity,
    @Param('category') category: CategoryCreateAnswer | CategoryAnswer,
  ): Promise<AnswerEntity[]> {
    return this.answerService.getAllSortedByCategory(user, category);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  create(
    @UserObj() user: UserEntity,
    @Body() body: AnswerCreateDto,
  ): Promise<AnswerEntity> {
    return this.answerService.create(user, body);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  update(
    @UserObj() user: UserEntity,
    @Param('id') id: string,
    @Body() body: AnswerUpdateDto,
  ): Promise<AnswerEntity> {
    return this.answerService.update(user, id, body);
  }

  @Put('/count/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  updateCount(@Param('id') id: string): Promise<number> {
    return this.answerService.updateCopyCount(id);
  }

  @Delete('/selected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  deleteMany(@UserObj() user: UserEntity, @Body() body: AnswerIds) {
    console.log(body);
    return this.answerService.deleteSelected(user, body);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  delete(@UserObj() user: UserEntity, @Param('id') id: string) {
    return this.answerService.delete(user, id);
  }
}
