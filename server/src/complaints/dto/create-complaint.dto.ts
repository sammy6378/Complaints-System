import { IsEnum, IsString } from 'class-validator';

export enum complaint_priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum complaint_status {
  Pending = 'Pending',
  UnderReview = 'Under Review',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Rejected = 'Rejected',
  Reopened = 'Reopened',
}
export class CreateComplaintDto {
  @IsString()
  complaint_title: string;

  @IsString()
  complaint_description: string;

  @IsEnum(complaint_status)
  complaint_status: complaint_status;

  @IsEnum(complaint_priority)
  priority: complaint_priority;

  @IsString()
  userId: string;

  @IsString()
  categoryId: string;

  @IsString()
  subcategoryId: string;

  @IsString()
  stateId: string;
}
