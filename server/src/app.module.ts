import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogsModule } from './logs/logs.module';
import { LoggerMiddleware } from './logger.middleware';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
// import { AtGuard } from './auth/guards/at.guard';
import { SeedModule } from './seed/seed.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { CacheableMemory } from 'cacheable';
import { createKeyv, Keyv } from '@keyv/redis';
import { RolesGuard } from './auth/guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';
import { CaslModule } from './casl/casl.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ComplaintHistoryModule } from './complaint-history/complaint-history.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [
    // global config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    // global cache
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          ttl: 30000, // 30 seconds
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 30000, lruSize: 5000 }),
            }),
            createKeyv(configService.getOrThrow<string>('REDIS_URL')),
          ],
          Logger: true,
        };
      },
    }),

    // rate limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    UsersModule,
    ComplaintsModule,
    CategoriesModule,
    DatabaseModule,
    LogsModule,
    AuthModule,
    SeedModule,
    MailModule,
    CaslModule,
    AuditLogsModule,
    ComplaintHistoryModule,
    FeedbacksModule,
    NotificationsModule,
    PaginationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor, // global cache interceptor
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AtGuard, // protected routes
    // },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // roles guard for role-based access control
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // rate limiting guard
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        '/api/users',
        '/api/logs',
        '/api/categories',
        '/api/subcategories',
        '/api/complaints',
        '/api/audit-logs',
        '/api/complaint-history',
        '/api/feedbacks',
        '/api/notifications',
        '/api/auth',
      ); // Apply logger middleware to all routes
  }
}
