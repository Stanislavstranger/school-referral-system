import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, ResponseRegisterDto } from './dto/register.dto';
import { LoginDto, ResponseLoginDto } from './dto/login.dto';
import { BadRequestException } from '@nestjs/common';
import { UserRole } from 'src/user/interfaces/user.interface';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockRegisterDto: RegisterDto = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'johndoe',
    phone: '1234567890',
    role: UserRole.Student,
  };

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockResponseRegisterDto: ResponseRegisterDto = {
    email: 'test@example.com',
  };

  const mockResponseLoginDto: ResponseLoginDto = {
    access_token: 'some-valid-token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('create', () => {
    it('should register a new user and return the email', async () => {
      authService.register.mockResolvedValue(mockResponseRegisterDto);

      const result = await authController.create(mockRegisterDto);

      expect(result).toEqual(mockResponseRegisterDto);
      expect(authService.register).toHaveBeenCalledWith(
        mockRegisterDto,
        undefined,
      );
    });

    it('should register a new user with a referral code', async () => {
      const referralCode = 'ref123';

      authService.register.mockResolvedValue(mockResponseRegisterDto);

      const result = await authController.create(mockRegisterDto, referralCode);

      expect(result).toEqual(mockResponseRegisterDto);
      expect(authService.register).toHaveBeenCalledWith(
        mockRegisterDto,
        referralCode,
      );
    });

    it('should throw an error if registration fails', async () => {
      authService.register.mockRejectedValue(
        new BadRequestException('Invalid data'),
      );

      await expect(authController.create(mockRegisterDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      authService.validateUser.mockResolvedValue({ id: { _id: '1' } });
      authService.login.mockResolvedValue(mockResponseLoginDto);

      const result = await authController.login(mockLoginDto);

      expect(result).toEqual(mockResponseLoginDto);
      expect(authService.validateUser).toHaveBeenCalledWith(mockLoginDto);
      expect(authService.login).toHaveBeenCalledWith({ _id: '1' });
    });

    it('should throw an error if login fails', async () => {
      authService.validateUser.mockRejectedValue(
        new BadRequestException('Invalid credentials'),
      );

      await expect(authController.login(mockLoginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
