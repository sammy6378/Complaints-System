import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([State, Complaint])],
  controllers: [StatesController],
  providers: [StatesService],
})
export class StatesModule {}
