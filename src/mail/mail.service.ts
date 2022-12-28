import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegisterLink(email: string, registerToken: string) {
    const url = process.env.CLIENT_URL;
    const mail = {
      to: email,
      subject: 'Answers APP registration link',
      template: 'registration-link',
      context: {
        registerToken,
        url,
      },
    };
    await this.mailerService.sendMail(mail);
  }

  async sendPasswordResetLink(email: string, resetLinkToken: string) {
    const url = process.env.CLIENT_URL;
    const mail = {
      to: email,
      subject: 'Answers APP link to reset your password',
      template: 'password-reset-link',
      context: {
        resetLinkToken,
        url,
      },
    };
    await this.mailerService.sendMail(mail);
  }
}
