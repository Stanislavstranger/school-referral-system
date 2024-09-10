import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AddPaymentDto } from './dto/add-payment.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Payments')
@ApiBearerAuth('JWT')
@Controller('payments')
export class PaymentController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  @ApiOperation({ summary: 'Add payment and allocate lessons' })
  @ApiResponse({
    status: 200,
    description: 'Payment processed and lessons added',
  })
  async addPayment(@Body() addPaymentDto: AddPaymentDto) {
    return this.userService.handlePayment(addPaymentDto);
  }
}
