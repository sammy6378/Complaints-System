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
import { ConfigModule } from '@nestjs/config';
import { LogsModule } from './logs/logs.module';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    UsersModule,
    AdminsModule,
    ComplaintsModule,
    CategoriesModule,
    SubcategoriesModule,
    StatesModule,
    UserLogsModule,
    AdminLogsModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/users'); // Apply logger middleware to all routes
  }
}
