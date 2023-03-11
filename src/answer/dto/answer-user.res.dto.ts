import { AuthLoginResDto } from '../../auth/dto/auth-login-res.dto';
import { OmitType } from '@nestjs/swagger';
import { AnswerUserRes } from 'types';

export class AnswerUserResDto
  extends OmitType(AuthLoginResDto, ['role'] as const)
  implements AnswerUserRes {}
