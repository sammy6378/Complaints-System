import { Module } from '@nestjs/common';
import { AdminLogsService } from './admin-logs.service';
import { AdminLogsController } from './admin-logs.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLog } from './entities/admin-log.entity';
import { Admin } from 'src/admins/entities/admin.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([AdminLog, Admin])],
  controllers: [AdminLogsController],
  providers: [AdminLogsService],
})
export class AdminLogsModule {}
