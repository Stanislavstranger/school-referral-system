import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { UserService } from 'src/user/user.service';
import { AddPaymentDto } from './dto/add-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let userService: jest.Mocked<UserService>;

  const mockAddPaymentDto: AddPaymentDto = {
    userId: 'user123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: UserService,
          useValue: {
            handlePayment: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    paymentController = module.get<PaymentController>(PaymentController);
    userService = module.get(UserService);
  });

  describe('addPayment', () => {
    it('should process payment and add lessons', async () => {
      userService.handlePayment.mockResolvedValue({
        message: 'Payment processed and lessons added',
      });

      const result = await paymentController.addPayment(mockAddPaymentDto);

      expect(result).toEqual({
        message: 'Payment processed and lessons added',
      });
      expect(userService.handlePayment).toHaveBeenCalledWith(mockAddPaymentDto);
    });

    it('should throw an error if the payment is not valid', async () => {
      userService.handlePayment.mockRejectedValue(new Error('Invalid payment'));

      await expect(
        paymentController.addPayment(mockAddPaymentDto),
      ).rejects.toThrow('Invalid payment');
      expect(userService.handlePayment).toHaveBeenCalledWith(mockAddPaymentDto);
    });
  });
});
