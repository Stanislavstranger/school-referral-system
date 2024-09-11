import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the student',
    example: 'student@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Password for the student's account",
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResponseLoginDto {
  @ApiProperty({
    description: "Access token for the student's account",
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;
}
