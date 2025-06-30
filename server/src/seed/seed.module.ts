import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Category } from 'src/categories/entities/category.entity';
import { DatabaseModule } from 'src/database/database.module';
import { AuditLog } from 'src/audit-logs/entities/audit-log.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { ComplaintHistory } from 'src/complaint-history/entities/complaint-history.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      Complaint,
      Category,
      AuditLog,
      Notification,
      Feedback,
      ComplaintHistory,
    ]),
  ],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
