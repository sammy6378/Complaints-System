import { IsDateString, IsEnum, IsString } from 'class-validator';
import { LoginStatus } from 'src/user-logs/dto/create-user-log.dto';

export class CreateAdminLogDto {
  @IsDateString()
  loginTime: Date;

  @IsEnum(LoginStatus)
  loginStatus: LoginStatus;

  @IsString()
  adminId: string;
}
