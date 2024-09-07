import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { isValidObjectId, Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';
import { THIS_USER_NOT_FOUND } from '../constants/user.constants';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(user: UserEntity) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async updateUser({ _id, ...rest }: UserEntity) {
    return this.userModel.updateOne({ _id }, { $set: { ...rest } }).exec();
  }

  async findAllUser() {
    return this.userModel.find().exec();
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string): Promise<Omit<IUser, 'passwordHash'>> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(THIS_USER_NOT_FOUND);
    return user;
  }

  async findUserByReferralCode(referralCode: string) {
    return this.userModel.findOne({ referralCode }).exec();
  }

  async deleteUser(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    this.userModel.deleteOne({ _id: id }).exec();
  }
}
