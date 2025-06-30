import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum ComplaintStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export class CreateComplaintHistoryDto {
  @ApiProperty({ description: 'ID of the complaint being updated' })
  @IsUUID()
  complaintId: string;

  @ApiProperty({ description: 'ID of the user making the status change' })
  @IsUUID()
  actorId: string;

  @ApiProperty({ enum: ComplaintStatus })
  @IsEnum(ComplaintStatus)
  from_status: ComplaintStatus;

  @ApiProperty({ enum: ComplaintStatus })
  @IsEnum(ComplaintStatus)
  to_status: ComplaintStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;

  @IsString()
  user_id: string;
}
