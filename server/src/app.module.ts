import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      Logger.log('✅ Database connected successfully', 'PostgreSQL');
    } catch (err) {
      Logger.error('❌ Database connection failed', err, 'PostgreSQL');
    }
  }
}
