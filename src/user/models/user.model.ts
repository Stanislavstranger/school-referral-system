import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  IUser,
  IUserLessons,
  PurchaseState,
  UserRole,
} from '../interfaces/user.interface';

@Schema()
export class UserLessons extends Document implements IUserLessons {
  @Prop({ required: true })
  lessonId: string;

  @Prop({
    required: true,
    enum: PurchaseState,
    type: String,
  })
  purchaseState: PurchaseState;
}

export const UserLessonsSchema = SchemaFactory.createForClass(UserLessons);
@Schema()
export class User extends Document implements IUser {
  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false })
  patronymic?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ unique: true, required: true })
  referralCode: string;

  @Prop()
  invitedStudents: string[];

  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.Student,
  })
  role: UserRole;

  @Prop({
    type: [UserLessonsSchema],
    _id: false,
  })
  lessons?: Types.Array<UserLessons>;

  @Prop({ required: true })
  version: number;

  @Prop({ required: true })
  createdAt: number;

  @Prop({ required: true })
  updatedAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
