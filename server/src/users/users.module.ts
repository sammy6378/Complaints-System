import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { UserLog } from 'src/user-logs/entities/user-log.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, Complaint, UserLog]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
