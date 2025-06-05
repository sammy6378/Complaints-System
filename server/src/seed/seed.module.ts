import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserLog } from 'src/user-logs/entities/user-log.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { AdminLog } from 'src/admin-logs/entities/admin-log.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { State } from 'src/states/entities/state.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      UserLog,
      Admin,
      AdminLog,
      Complaint,
      Category,
      Subcategory,
      State,
    ]),
  ],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
