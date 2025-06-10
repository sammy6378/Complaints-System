import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { UserLog } from 'src/user-logs/entities/user-log.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, Complaint, UserLog]),
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard, MailService],
})
export class UsersModule {}
