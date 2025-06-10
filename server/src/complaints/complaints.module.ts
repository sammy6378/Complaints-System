import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { State } from 'src/states/entities/state.entity';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Complaint, User, Category, Subcategory, State]),
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService, PoliciesGuard, CaslAbilityFactory],
})
export class ComplaintsModule {}
