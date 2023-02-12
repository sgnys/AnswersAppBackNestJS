import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from 'src/mail/mail.module';
import { AnswerTemplateModule } from '../answer-template/answer-template.module';

@Module({
  imports: [MailModule, AnswerTemplateModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
