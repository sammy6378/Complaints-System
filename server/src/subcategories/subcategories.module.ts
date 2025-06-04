import { Module } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Subcategory, Category, Complaint]),
  ],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
})
export class SubcategoriesModule {}
