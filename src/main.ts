import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
// @ts-ignore
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use('/api/v1/payments/webhook', bodyParser.raw({ type: 'application/json' }));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new (require('@nestjs/common').ValidationPipe)({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
