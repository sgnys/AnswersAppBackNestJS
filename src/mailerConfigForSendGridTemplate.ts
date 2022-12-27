import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailerConfigForSendGridTemplate = {
  transport: {
    host: 'smtp.sendgrid.net',
    auth: {
      user: 'apikey',
      pass: 'Example-Secret-Password',
    },
  },
  defaults: {
    from: 'email@example',
  },
  template: {
    dir: join(__dirname, 'templates/email'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
