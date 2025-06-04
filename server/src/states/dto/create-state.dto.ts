import { IsString } from 'class-validator';

export class CreateStateDto {
  @IsString()
  stateName: string;

  @IsString()
  description: string;
}
