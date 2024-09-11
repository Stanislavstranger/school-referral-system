import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'The current password of the user',
    example: 'oldPassword123',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password to be set',
    example: 'newPassword456',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
