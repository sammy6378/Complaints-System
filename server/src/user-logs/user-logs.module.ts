import { Module } from '@nestjs/common';
import { UserLogsService } from './user-logs.service';
import { UserLogsController } from './user-logs.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLog } from './entities/user-log.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([UserLog, User])],
  controllers: [UserLogsController],
  providers: [UserLogsService],
})
export class UserLogsModule {}
