import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from './models/user.model';
import { IUser } from './interfaces/user.interface';

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUser = {
    _id: '1',
    displayName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123456789',
    referralCode: 'ref123',
    lessons: [],
    role: 'Student',
  } as unknown as Document & User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      userService.findAll.mockResolvedValue([mockUser]);

      const result = await userController.findAll();
      expect(result).toEqual([mockUser]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      userService.findOne.mockResolvedValue({
        profile: { ...mockUser } as Omit<
          IUser,
          'passwordHash' | 'invitedStudents'
        >,
      });

      const result = await userController.findOne('1');
      expect(result).toEqual({ profile: { ...mockUser } });
      expect(userService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      userService.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(userController.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(userService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      userService.remove.mockResolvedValue();

      const result = await userController.remove('1');
      expect(result).toEqual(undefined);
      expect(userService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found during deletion', async () => {
      userService.remove.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(userController.remove('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(userService.remove).toHaveBeenCalledWith('1');
    });
  });
});
