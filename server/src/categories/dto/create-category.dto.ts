import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Health',
    type: String,
    required: true,
  })
  @IsString()
  category_name: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'This category includes health-related topics.',
    type: String,
    required: true,
  })
  @IsString()
  description: string;

  @IsArray()
  sub_categories: string[];
}
