import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DatabaseModule } from 'src/database/database.module';
import { Complaint } from 'src/complaints/entities/complaint.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Category, Complaint])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
