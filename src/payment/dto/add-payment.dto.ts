import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPaymentDto {
  @ApiProperty({ description: 'User ID for whom the payment is made' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
