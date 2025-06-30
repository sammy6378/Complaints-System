import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from 'src/users/entities/user.entity';
import { LogsService } from 'src/logs/logs.service';
import { Complaint } from 'src/complaints/entities/complaint.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([AuditLog, User, Complaint]),
  ],
  controllers: [AuditLogsController],
  providers: [AuditLogsService, LogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
