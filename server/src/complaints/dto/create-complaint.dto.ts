import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

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
  @ApiProperty({
    description: 'Title of the complaint',
    example: 'Noise Complaint',
    type: String,
    required: true,
  })
  @IsString()
  complaint_title: string;

  @ApiProperty({
    description: 'Detailed description of the complaint',
    example: 'There is excessive noise coming from the neighbor’s apartment.',
    type: String,
    required: true,
  })
  @IsString()
  complaint_description: string;

  @ApiProperty({
    description: 'Status of the complaint',
    example: 'Pending',
    enum: complaint_status,
    required: false,
    default: complaint_status.Pending,
  })
  @IsEnum(complaint_status)
  @IsOptional()
  complaint_status: complaint_status;

  @ApiProperty({
    description: 'Priority of the complaint',
    example: 'High',
    enum: complaint_priority,
    required: true,
  })
  @IsEnum(complaint_priority)
  priority: complaint_priority;

  @ApiProperty({
    description: 'Location of the complaint',
    example: '123 Main St, Springfield, IL',
    type: String,
    required: true,
  })
  @IsString()
  location: string;

  @IsString()
  user_id: string;

  @IsString()
  category_id: string;

  @IsString()
  @IsOptional()
  subcategory_id?: string;
}
