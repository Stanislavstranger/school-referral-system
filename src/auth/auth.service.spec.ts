import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  INVALID_REFERRAL_CODE,
  THIS_USER_ALREADY_REGISTERED,
} from 'src/user/constants/user.constants';
import { INCORRECT_LOGIN_OR_PASSWORD } from './constants/auth.constants';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/models/user.model';
import { UserRole } from 'src/user/interfaces/user.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    _id: '1',
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    referralCode: 'ref123',
    parentReferralCode: 'refParent123',
    firstName: 'John',
    lastName: 'Doe',
    lessons: [],
    role: 'Student',
  } as unknown as Document & User & Required<{ _id: unknown }>;

  const registerDto: RegisterDto = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    displayName: '',
    phone: '',
    role: UserRole.Student,
  };

  const loginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findUserByEmail: jest.fn(),
            findUserByReferralCode: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            findUserById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should register a new user and return the user email', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue(mockUser);

      const result = await authService.register(registerDto);

      expect(result).toEqual({ email: 'test@example.com' });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(userRepository.createUser).toHaveBeenCalled();
    });

    it('should throw an error if the user already exists', async () => {
      userRepository.findUserByEmail.mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        new BadRequestException(THIS_USER_ALREADY_REGISTERED),
      );
    });

    it('should throw an error if the referral code is invalid', async () => {
      userRepository.findUserByReferralCode.mockResolvedValue(null);

      await expect(
        authService.register(registerDto, 'invalidCode'),
      ).rejects.toThrow(new BadRequestException(INVALID_REFERRAL_CODE));
    });
  });

  describe('validateUser', () => {
    it('should validate the user and return the user ID', async () => {
      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(UserEntity.prototype, 'validatePassword')
        .mockResolvedValueOnce(true);

      const result = await authService.validateUser(loginDto);

      expect(result).toEqual({ id: '1' });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw an error if the user is not found', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);

      await expect(authService.validateUser(loginDto)).rejects.toThrow(
        new BadRequestException(INCORRECT_LOGIN_OR_PASSWORD),
      );
    });

    it('should throw an error if the password is incorrect', async () => {
      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(UserEntity.prototype, 'validatePassword')
        .mockResolvedValueOnce(false);

      await expect(authService.validateUser(loginDto)).rejects.toThrow(
        new BadRequestException(INCORRECT_LOGIN_OR_PASSWORD),
      );
    });
  });

  describe('login', () => {
    it('should log in the user and return an access token', async () => {
      const userId = { _id: '1' };

      userRepository.findUserById.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('accessToken123');

      const result = await authService.login(userId);

      expect(result).toEqual({ access_token: 'accessToken123' });
      expect(userRepository.findUserById).toHaveBeenCalledWith(
        userId.toString(),
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: 'John',
        sub: '1',
        role: 'Student',
      });
    });
  });
});
