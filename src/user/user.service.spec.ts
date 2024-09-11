import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserRole } from './interfaces/user.interface';
import { AddPaymentDto } from 'src/payment/dto/add-payment.dto';
import { User } from './models/user.model';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = {
    _id: '1',
    displayName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123456789',
    passwordHash: 'hashed_password',
    referralCode: 'ref123',
    parentReferralCode: null,
    lessons: [],
    role: UserRole.Student,
  } as unknown as Document & User & Required<{ _id: unknown }>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findAllUser: jest.fn(),
            findUserById: jest.fn(),
            deleteUser: jest.fn(),
            updateUser: jest.fn(),
            findUserByReferralCode: jest.fn(),
            updateUserLesson: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      userRepository.findAllUser.mockResolvedValue([mockUser]);

      const result = await userService.findAll();
      expect(result).toEqual([mockUser]);
      expect(userRepository.findAllUser).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      userRepository.findUserById.mockResolvedValue(mockUser);

      const result = await userService.findOne('1');
      expect(result.profile).toEqual(
        await new UserEntity(mockUser).getPublicProfile(),
      );
      expect(userRepository.findUserById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(userService.findOne('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('handlePayment', () => {
    const mockAddPaymentDto: AddPaymentDto = { userId: '1' };

    it('should process payment and add lessons', async () => {
      userRepository.findUserById.mockResolvedValue(mockUser);
      userRepository.findUserByReferralCode.mockResolvedValue(mockUser);

      const result = await userService.handlePayment(mockAddPaymentDto);

      expect(result).toEqual({
        message: 'Payment processed and lessons added',
      });
      expect(userRepository.findUserById).toHaveBeenCalledWith('1');
    });
  });

  describe('getReferralStatistics', () => {
    it('should return referral statistics', async () => {
      userRepository.findAllUser.mockResolvedValue([mockUser]);

      const result = await userService.getReferralStatistics();
      expect(result).toEqual({
        totalInvited: 0,
        referrers: {},
      });
      expect(userRepository.findAllUser).toHaveBeenCalled();
    });
  });
});
