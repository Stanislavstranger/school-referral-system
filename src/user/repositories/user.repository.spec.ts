import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { Model } from 'mongoose';

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  isValidObjectId: jest.fn().mockImplementation((id) => id === 'userId'),
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: jest.Mocked<Model<User>>;

  const mockUser = {
    _id: 'userId',
    email: 'test@example.com',
    referralCode: 'ref123',
    parentReferralCode: 'refParent123',
    firstName: 'John',
    lastName: 'Doe',
    lessons: [],
    role: 'Student',
  } as unknown as Document & UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userModel = module.get<Model<User>>(
      getModelToken(User.name),
    ) as jest.Mocked<Model<User>>;
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const findByIdMock = jest.fn().mockResolvedValue(mockUser);
      userModel.findById.mockReturnValue({ exec: findByIdMock } as any);

      const result = await userRepository.findUserById(mockUser._id.toString());

      expect(result).toEqual(mockUser);
      expect(userModel.findById).toHaveBeenCalledWith(mockUser._id);
      expect(findByIdMock).toHaveBeenCalled();
    });

    it('should throw BadRequestException if ID is invalid', async () => {
      await expect(userRepository.findUserById('invalid-id')).rejects.toThrow(
        new BadRequestException('Invalid user ID'),
      );
    });
  });
});
