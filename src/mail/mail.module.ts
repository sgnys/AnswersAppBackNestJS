import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { mailerConfigForSendGrid } from '../../mailerConfigForSendGrid';

@Module({
  imports: [MailerModule.forRoot(mailerConfigForSendGrid)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
