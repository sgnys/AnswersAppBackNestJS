import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AnswerTemplateService } from './answer-template.service';
import { AnswerTemplateEntity } from './answer-template.entity';
import { AnswerTemplateUpdateDto } from './dto/answer-template-update.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { AnswerTemplateRes, UserRoles } from '../../types';
import { UserObj } from '../decorators/user-object.decorator';
import { UserEntity } from '../user/user.entity';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { AnswerTemplateResDto } from './dto/swagger/answer-template.res.dto';
import {
  AnswerTemplateNotExistExceptionResDto,
  NoChangesExceptionResDto,
} from './dto/swagger/update-template-exception.res.dto';

@ApiTags('Answer Template')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  schema: { example: { status: 500, message: 'Please try later.' } },
})
@ApiSecurity('api_key')
@ApiForbiddenResponse({
  description: 'Forbidden',
  schema: { example: { status: 401, message: 'Forbidden resource' } },
})
@ApiExtraModels(AnswerTemplateNotExistExceptionResDto, NoChangesExceptionResDto)
@Controller('api/answer-template')
export class AnswerTemplateController {
  constructor(private answerTemplateService: AnswerTemplateService) {}

  @ApiOperation({ summary: 'Get list of all Users answer templates - [Admin]' })
  @ApiOkResponse({
    description: 'Lists of all answer templates only for the Admin role',
    type: [AnswerTemplateEntity],
  })
  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  getAll(): Promise<AnswerTemplateRes[]> {
    return this.answerTemplateService.getAll();
  }

  @ApiOperation({
    summary: 'Get list of answer templates for single User - [Admin, User]',
  })
  @ApiOkResponse({
    description: 'List of all answer templates only for User',
    type: [AnswerTemplateResDto],
  })
  @Get('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getUserTemplates(@UserObj() user: UserEntity): Promise<AnswerTemplateRes[]> {
    return this.answerTemplateService.getTemplates(user);
  }

  @ApiOperation({
    summary: 'Get answer template for a single User - [Admin, User]',
  })
  @ApiParam({
    description: 'Answer template id (uuid)',
    name: 'id',
  })
  @ApiOkResponse({
    description: 'Return single answer template',
    type: AnswerTemplateResDto,
  })
  @ApiBadRequestResponse({
    description: 'Answer does not exist',
    type: AnswerTemplateNotExistExceptionResDto,
  })
  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getOne(
    @UserObj() user: UserEntity,
    @Param('id') id: string,
  ): Promise<AnswerTemplateRes> {
    return this.answerTemplateService.getTemplateById(user, id);
  }

  @ApiOperation({ summary: 'Update answer template - [Admin, User]' })
  @ApiParam({
    description: 'Answer template id (uuid)',
    name: 'id',
  })
  @ApiCreatedResponse({
    description: 'Return updated answer template',
    type: AnswerTemplateResDto,
  })
  @ApiBadRequestResponse({
    description: 'Schemas of exceptions',
    schema: {
      anyOf: refs(
        AnswerTemplateNotExistExceptionResDto,
        NoChangesExceptionResDto,
      ),
    },
  })
  @Put('/:id')
  @ApiBody({
    type: AnswerTemplateUpdateDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  update(
    @UserObj() user: UserEntity,
    @Body() body: AnswerTemplateUpdateDto,
    @Param('id') id: string,
  ): Promise<AnswerTemplateRes> {
    return this.answerTemplateService.updateTemplate(user, id, body);
  }
}
