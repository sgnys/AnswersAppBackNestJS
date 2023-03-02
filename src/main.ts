import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      //disableErrorMessages: true, //@TODO only production
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Answers App APIs Definition')
    .setDescription('# About Us')
    .setDescription(
      '##### The application **Answers App** allows answers to be created and then searched for by text. Answers can be deleted, edited, as well as copied to the clipboard and their category changed. The application allows you to manage answer templates.',
    )
    .setVersion('1.0')
    .addTag('Answers App')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'api_key',
        in: 'cookie',
        description:
          'Swagger UI does not support cookie authenticated. After correct login, copy the JWT token from BE, to use it for authorization.',
      },
      'api_key',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
