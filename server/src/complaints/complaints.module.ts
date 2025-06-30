import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ComplaintHistory } from 'src/complaint-history/entities/complaint-history.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { PaginationModule } from 'src/pagination/pagination.module';
import { LogsService } from 'src/logs/logs.service';
import { ComplaintAuditHelper } from 'src/utils/audit-helper.service';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';
import { AuditLog } from 'src/audit-logs/entities/audit-log.entity';

@Module({
  imports: [
    DatabaseModule,
    PaginationModule,
    AuditLogsModule,
    TypeOrmModule.forFeature([
      Complaint,
      User,
      Category,
      ComplaintHistory,
      Feedback,
      AuditLog,
    ]),
  ],
  controllers: [ComplaintsController],
  providers: [
    ComplaintsService,
    PoliciesGuard,
    CaslAbilityFactory,
    LogsService,
    ComplaintAuditHelper,
  ],
})
export class ComplaintsModule {}
