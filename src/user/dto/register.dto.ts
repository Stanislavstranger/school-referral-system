import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../interfaces/user.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Display name of the student' })
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty({ description: 'First name of the student' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the student' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'Patronymic (optional)' })
  @IsOptional()
  @IsString()
  patronymic?: string;

  @ApiProperty({ description: 'Email address of the student' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number of the student' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: "Password for the student's account" })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: 'Referral code (optional)' })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiProperty({
    description: 'Role of the user (Teacher or Student)',
    enum: UserRole,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

export class ResponseRegisterDto {
  @ApiProperty({ description: 'Email of the registered student' })
  email: string;
}
