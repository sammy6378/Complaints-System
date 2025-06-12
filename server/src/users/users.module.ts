import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { MailService } from 'src/mail/mail.service';
import { AuditLog } from 'src/audit-logs/entities/audit-log.entity';
import { ComplaintHistory } from 'src/complaint-history/entities/complaint-history.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      Complaint,
      AuditLog,
      ComplaintHistory,
      Notification,
      Feedback,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard, MailService],
})
export class UsersModule {}
