import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../interfaces/user.interface';

export class FindUserDto {
  @ApiProperty({ description: 'Display id of the student' })
  @IsNotEmpty()
  @IsString()
  _id: string;

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

  @ApiProperty({
    description: 'Lessons of the user (optional)',
  })
  @IsOptional()
  lesson: string;
}
