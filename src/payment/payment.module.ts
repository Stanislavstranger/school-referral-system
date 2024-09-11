import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [UserModule],
  controllers: [PaymentController],
  providers: [UserService],
})
export class PaymentModule {}
