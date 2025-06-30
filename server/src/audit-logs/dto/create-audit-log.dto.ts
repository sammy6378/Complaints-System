import { ApiProperty } from '@nestjs/swagger';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  VIEW = 'VIEW',
  OTHER = 'OTHER',
}

export class CreateAuditLogDto {
  @ApiProperty({ description: 'ID of the user who performed the action' })
  @IsUUID()
  actor_id: string;

  @ApiProperty({ enum: AuditAction })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({ description: 'Affected entity name, e.g. Complaint, User' })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiProperty({ description: 'ID of the affected resource', required: false })
  @IsString()
  @IsOptional()
  resource_id?: string;

  @ApiProperty({
    description: 'Optional details about the action',
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;

  @IsString()
  user_id: string;
}
