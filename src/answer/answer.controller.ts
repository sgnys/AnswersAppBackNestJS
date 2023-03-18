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
import { AnswerEntity } from './answer.entity';
import { AnswerUpdateDto } from './dto/answer-update.dto';
import {
  AnswerRes,
  CategoryAnswer,
  CategoryCreateAnswer,
  UserRoles,
  CreateAnswerRes,
} from 'types';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UserObj } from '../decorators/user-object.decorator';
import { UserEntity } from '../user/user.entity';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AnswerResDto } from './dto/swagger/answer.res.dto';
import { AnswerCreateReqDto } from './dto/answer-create.req.dto';
import { AnswerNotExistExceptionResDto } from './dto/swagger/answer-not-exist-exception.res.dto';
import { AnswerIdsReqDto } from './dto/answer-ids.req.dto';

@ApiTags('Answer')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  schema: { example: { status: 500, message: 'Please try later.' } },
})
@ApiSecurity('api_key')
@ApiForbiddenResponse({
  description: 'Forbidden',
  schema: { example: { status: 401, message: 'Forbidden resource' } },
})
@Controller('api/answer')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @ApiOperation({ summary: 'Get list of all Users answers - [Admin]' })
  @ApiOkResponse({
    description: 'Lists of all Answers only for the Admin role',
    type: [AnswerEntity],
  })
  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  getAll(): Promise<AnswerRes[]> {
    return this.answerService.getAll();
  }

  @ApiOperation({
    summary: 'Get list of answers for single User - [Admin, User]',
  })
  @ApiOkResponse({
    description: 'List of all Answers only for User',
    type: [AnswerResDto],
  })
  @Get('/')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getUserAnswers(@UserObj() user: UserEntity): Promise<AnswerRes[]> {
    return this.answerService.getAnswers(user);
  }

  @ApiOperation({ summary: 'Get answer for a single User - [Admin, User]' })
  @ApiParam({
    description: 'Answer id (uuid)',
    name: 'id',
  })
  @ApiOkResponse({
    description: 'Return single answer',
    type: AnswerResDto,
  })
  @ApiBadRequestResponse({
    description: 'Answer does not exist',
    type: AnswerNotExistExceptionResDto,
  })
  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getOne(
    @UserObj() user: UserEntity,
    @Param('id') id: string,
  ): Promise<AnswerRes> {
    return this.answerService.getAnswerById(user, id);
  }

  @ApiOperation({ summary: 'List of Answers by category - [Admin, User]' })
  @ApiParam({
    description: 'The name of category',
    name: 'category',
  })
  @ApiOkResponse({
    description: 'List of Answers by category',
    type: [AnswerResDto],
  })
  @ApiBadRequestResponse({
    description: 'Error when no category was marked',
    schema: {
      example: {
        status: 400,
        message: `No answer category was marked`,
      },
    },
  })
  @Get('/sort/:category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  getSorted(
    @UserObj() user: UserEntity,
    @Param('category') category: CategoryCreateAnswer | CategoryAnswer,
  ): Promise<AnswerRes[]> {
    return this.answerService.getAllSortedByCategory(user, category);
  }

  @ApiOperation({ summary: 'Create new answer - [Admin, User]' })
  @ApiCreatedResponse({
    description: 'Returns created answer',
    type: AnswerResDto,
  })
  @Post('/')
  @ApiBody({
    type: AnswerCreateReqDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  create(
    @UserObj() user: UserEntity,
    @Body() body: AnswerCreateReqDto,
  ): Promise<CreateAnswerRes> {
    return this.answerService.create(user, body);
  }

  @ApiOperation({ summary: 'Update answer - [Admin, User]' })
  @ApiParam({
    description: 'Answer id (uuid)',
    name: 'id',
  })
  @ApiCreatedResponse({
    description: 'Return updated answer',
    type: AnswerResDto,
  })
  @ApiBadRequestResponse({
    description: 'Answer does not exist',
    type: AnswerNotExistExceptionResDto,
  })
  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  update(
    @UserObj() user: UserEntity,
    @Param('id') id: string,
    @Body() body: AnswerUpdateDto,
  ): Promise<AnswerRes> {
    return this.answerService.update(user, id, body);
  }

  @ApiOperation({
    summary:
      'Update copyBtnCount value - number of clicks on copy button - [Admin, User]',
  })
  @ApiParam({
    description: 'Answer id (uuid)',
    name: 'id',
  })
  @ApiOkResponse({
    description: 'Success of update copyBtnCount value',
    schema: {
      type: 'integer',
      example: 1,
    },
  })
  @Put('/count/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  updateCount(@Param('id') id: string): Promise<number> {
    return this.answerService.updateCopyCount(id);
  }

  @ApiOperation({ summary: 'Delete selected answers - [Admin, User]' })
  @ApiOkResponse({
    description: 'Success of deleting selected answers',
    schema: {
      example: {
        status: 200,
        message: `Selected answers has been removed from the list`,
      },
    },
  })
  @Delete('/selected')
  @ApiBody({
    type: AnswerIdsReqDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  deleteMany(@UserObj() user: UserEntity, @Body() body: AnswerIdsReqDto) {
    console.log(body);
    return this.answerService.deleteSelected(user, body);
  }

  @ApiOperation({ summary: 'Delete answer - [Admin, User]' })
  @ApiParam({
    description: 'Answer id (uuid)',
    name: 'id',
  })
  @ApiOkResponse({
    description: 'Success of deleting answer',
    schema: {
      example: {
        status: 200,
        message: `The answer has been removed from the list`,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Answer does not exist',
    type: AnswerNotExistExceptionResDto,
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MEMBER)
  delete(@UserObj() user: UserEntity, @Param('id') id: string) {
    return this.answerService.delete(user, id);
  }
}
