import { IsEnum, IsString } from 'class-validator';

export enum LoginStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}
export class CreateUserLogDto {
  @IsEnum(LoginStatus)
  loginStatus: LoginStatus;

  @IsString()
  action: string;

  @IsString()
  userId: string;
}
