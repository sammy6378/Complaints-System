import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum NotificationType {
  SYSTEM = 'system',
  COMPLAINT = 'complaint',
  FEEDBACK = 'feedback',
  ALERT = 'alert',
}

export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Main notification message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ enum: NotificationType, default: NotificationType.SYSTEM })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @IsUUID()
  userId: string;
}
