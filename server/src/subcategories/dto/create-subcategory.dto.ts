import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({
    description: 'Name of the subcategory',
    example: 'Cardiology',
    type: String,
    required: true,
  })
  @IsString()
  subcategory_name: string;

  @ApiProperty({
    description: 'Description of the subcategory',
    example: 'This subcategory includes topics related to heart health.',
    type: String,
    required: true,
  })
  @IsString()
  description: string;

  @IsString()
  categoryId: string;
}
