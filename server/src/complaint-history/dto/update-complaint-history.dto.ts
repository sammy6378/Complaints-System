import { PartialType } from '@nestjs/swagger';
import { CreateComplaintHistoryDto } from './create-complaint-history.dto';

export class UpdateComplaintHistoryDto extends PartialType(
  CreateComplaintHistoryDto,
) {}
