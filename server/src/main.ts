import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, RequestMethod } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';

async function bootstrap() {
  // create a NestJS application instance
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'], // configure logger levels
  });

  // helmet
  app.use(helmet());

  // validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out properties that are not in the DTO
      forbidNonWhitelisted: true, // throw an error if a property is not in the DTO is in the request body
      transform: true, // transform the request body to be an instance of the DTO class after validation and not a plain object
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

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
    .setTitle('ResolveIt Complaints System')
    .setDescription('API documentation for ResolveIt Complaints System')
    .setVersion('1.0')
    .addServer('http://localhost:8000', 'Development server')
    .addServer('https://api.complaints.com', 'Production server')
    .addTag('auth', 'Authentication related endpoints')
    .addTag('users', 'User related endpoints')
    .addTag('complaints', 'Complaint related endpoints')
    .addTag('categories', 'Category related endpoints')
    .addTag('subcategories', 'Subcategory related endpoints')
    .addTag('seed', 'Database seeding related endpoints')
    .addTag('AuditLogs', 'Audit log related endpoints')
    .addTag('Notifications', 'Notification related endpoints')
    .addTag('Feedbacks', 'Feedback related endpoints')
    .addTag('ComplaintHistory', 'Complaint history related endpoints')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    jsonDocumentUrl: '/api/docs-json',
    yamlDocumentUrl: '/api/docs-yaml',
    swaggerOptions: {
      persistAuthorization: true, // Persist authorization header
      displayRequestDuration: true, // Display request duration in UI
      tagsSorter: 'alpha', // Sort tags alphabetically
      operationsSorter: 'alpha', // Sort operations alphabetically
      filter: true, // Enable filtering
      tryItOutEnabled: true, // Enable "Try it out" feature
      docExpansion: 'none', // Collapse all sections by default
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin-bottom: 20px; }`,
  });

  // port configuration
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');

  // cors configuration
  const allowedOrigin =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL // Deployed frontend URL
      : 'http://localhost:3000'; // Local development URL

  const corsOptions = {
    origin: allowedOrigin, // Allow frontend
    credentials: true, // Allow cookies, sessions
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  };

  app.enableCors(corsOptions);

  await app.listen(PORT);

  Logger.log(`Server is running on http://localhost:${PORT}`);
}

bootstrap();
