import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';

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
    return this.userModel
      .findById(id)
      .select({
        _id: true,
        displayName: true,
        firstName: true,
        lastName: true,
        patronymic: true,
        email: true,
        phone: true,
        passwordHash: true,
        referralCode: true,
        invitedStudents: true,
        role: true,
        lessons: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      })
      .lean<Omit<IUser, 'passwordHash'>>()
      .exec();
  }

  async findUserByReferralCode(referralCode: string) {
    return this.userModel.findOne({ referralCode }).exec();
  }

  async deleteUser(id: string): Promise<void> {
    this.userModel.deleteOne({ _id: id }).exec();
  }
}
