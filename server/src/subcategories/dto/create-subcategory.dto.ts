import { IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  subcategoryName: string;

  @IsString()
  description: string;

  @IsString()
  categoryId: string;
}
