import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, RequestMethod } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  // swagger Ui
  const config = new DocumentBuilder()
    .setTitle('Complaints System')
    .setDescription('API documentation for the Complaints System')
    .setVersion('1.0')
    .addTag('complaint')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/reference', app, documentFactory);

  // port configuration
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  // const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  Logger.log(`Server is running on http://localhost:${PORT}`);
}

bootstrap();
