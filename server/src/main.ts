import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // create a NestJS application instance
  const app = await NestFactory.create(AppModule);

  // add global validation pipe
  app.useGlobalPipes(new ValidationPipe());

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
