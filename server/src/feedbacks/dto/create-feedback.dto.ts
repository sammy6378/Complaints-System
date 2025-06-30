import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'Message or feedback content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Optional rating from 1 to 5', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsString()
  user_id: string;

  @IsOptional()
  @IsUUID()
  complaint_id: string;
}
