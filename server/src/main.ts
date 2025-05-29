import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exceptions.filter';

async function bootstrap() {
  // create a NestJS application instance
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // configure logger levels
  });

  // add global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // register global exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // add global prefix for API routes
  app.setGlobalPrefix('api');

  // port configuration
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  // const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  Logger.log(`Server is running on http://localhost:${PORT}`);
}

bootstrap();
