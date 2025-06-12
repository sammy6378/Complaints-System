import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class CreatePaginationDto {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsInt()
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
}
