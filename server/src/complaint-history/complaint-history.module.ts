import { Module } from '@nestjs/common';
import { ComplaintHistoryService } from './complaint-history.service';
import { ComplaintHistoryController } from './complaint-history.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { ComplaintHistory } from './entities/complaint-history.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ComplaintHistory, Complaint, User]),
  ],
  controllers: [ComplaintHistoryController],
  providers: [ComplaintHistoryService],
})
export class ComplaintHistoryModule {}
