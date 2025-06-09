import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { StatesModule } from './states/states.module';
import { UserLogsModule } from './user-logs/user-logs.module';
import { AdminLogsModule } from './admin-logs/admin-logs.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogsModule } from './logs/logs.module';
import { LoggerMiddleware } from './logger.middleware';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards/at.guard';
import { SeedModule } from './seed/seed.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { CacheableMemory } from 'cacheable';
import { createKeyv, Keyv } from '@keyv/redis';
import { RolesGuard } from './auth/guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    // global config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
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
    AdminsModule,
    ComplaintsModule,
    CategoriesModule,
    SubcategoriesModule,
    StatesModule,
    UserLogsModule,
    AdminLogsModule,
    DatabaseModule,
    LogsModule,
    AuthModule,
    SeedModule,
    MailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor, // global cache interceptor
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard, // protected routes
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // roles guard for role-based access control
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
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
        '/api/user_logs',
        '/api/admin_logs',
        '/api/subcategories',
        '/api/states',
        '/api/complaints',
        '/api/admins',
        '/api/auth',
      ); // Apply logger middleware to all routes
  }
}
