import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

// enum
export enum Check {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    required: true,
    example: 'John Doe',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    description: 'Username of the user',
    required: true,
    example: 'johndoe123',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Email address of the user',
    required: true,
    example: 'johndoe@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the user',
    required: true,
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({
    description: 'Status of the user account',
    required: false,
    enum: Check,
    default: Check.ACTIVE,
  })
  @IsEnum(Check)
  status: Check;

  constructor() {
    this.status = Check.ACTIVE;
  }

  @ApiProperty({
    description: 'Role of the user',
    required: false,
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;

  @ApiProperty({
    description: 'Password for the user',
    required: true,
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsOptional()
  refresh_token: string | null;
}
