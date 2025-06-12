import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ComplaintHistory } from 'src/complaint-history/entities/complaint-history.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { PaginationModule } from 'src/pagination/pagination.module';
import { LogsService } from 'src/logs/logs.service';

@Module({
  imports: [
    DatabaseModule,
    PaginationModule,
    TypeOrmModule.forFeature([
      Complaint,
      User,
      Category,
      Subcategory,
      ComplaintHistory,
      Feedback,
    ]),
  ],
  controllers: [ComplaintsController],
  providers: [
    ComplaintsService,
    PoliciesGuard,
    CaslAbilityFactory,
    LogsService,
  ],
})
export class ComplaintsModule {}
