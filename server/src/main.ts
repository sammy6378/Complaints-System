import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';

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

  // swagger Ui
  const config = new DocumentBuilder()
    .setTitle('Complaints System')
    .setDescription('API documentation for the Complaints System')
    .setVersion('1.0')
    .addTag('complaint')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/reference', app, documentFactory);

  // port configuration
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  // const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  // default route
  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.send(
      `<h1>Welcome to the Complaints System API</h1>
       <p>Visit <a href="https://complaints-system-production.up.railway.app/api/reference">Documentation</a> for API documentation.</p>
        <p>Visit <a href="https://complaints-system-production.up.railway.app">Live</a> Deployed site</p>`,
    );
  });

  Logger.log(`Server is running on http://localhost:${PORT}`);
}

bootstrap();
