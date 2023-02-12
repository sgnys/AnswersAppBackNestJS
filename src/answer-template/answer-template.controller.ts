import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AnswerTemplateService } from './answer-template.service';
import { AnswerTemplateEntity } from './answer-template.entity';
import { AnswerTemplateUpdateDto } from './dto/answer-template-update.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRoles } from '../../types';
import { UserObj } from '../decorators/user-object.decorator';
import { UserEntity } from '../user/user.entity';

@Controller('api/answer-template')
export class AnswerTemplateController {
  constructor(private answerTemplateService: AnswerTemplateService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  getAll(): Promise<AnswerTemplateEntity[]> {
    return this.answerTemplateService.getAll();
  }

  @Get('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getUserTemplates(
    @UserObj() user: UserEntity,
  ): Promise<AnswerTemplateEntity[]> {
    return this.answerTemplateService.getTemplates(user);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getOne(
    @UserObj() user: UserEntity,
    @Param('id') id: string,
  ): Promise<AnswerTemplateEntity> {
    return this.answerTemplateService.getTemplateById(user, id);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  update(
    @UserObj() user: UserEntity,
    @Body() body: AnswerTemplateUpdateDto,
    @Param('id') id: string,
  ): Promise<AnswerTemplateEntity> {
    return this.answerTemplateService.updateTemplate(user, id, body);
  }
}
