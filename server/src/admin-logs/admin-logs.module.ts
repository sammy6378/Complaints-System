import { Module } from '@nestjs/common';
import { AdminLogsService } from './admin-logs.service';
import { AdminLogsController } from './admin-logs.controller';

@Module({
  controllers: [AdminLogsController],
  providers: [AdminLogsService],
})
export class AdminLogsModule {}
