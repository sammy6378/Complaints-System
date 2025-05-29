import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum LoginStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}
export class CreateUserLogDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsEnum(LoginStatus)
  login_status: LoginStatus;

  @IsString()
  action: string;
}
