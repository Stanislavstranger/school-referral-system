import { Exclude } from 'class-transformer';
import { SUCH_A_RESERVATION_ALREADY_EXISTS } from '../constants/user.constants';
import {
  IUser,
  UserRole,
  IUserLessons,
  PurchaseState,
} from '../interfaces/user.interface';
import { compare, genSalt, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class UserEntity implements IUser {
  _id?: unknown;
  displayName: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  email: string;
  phone: string;
  @Exclude()
  passwordHash: string;
  referralCode: string;
  invitedStudents?: string[];
  role: UserRole;
  lessons?: IUserLessons[];

  constructor(user: Omit<IUser, 'passwordHash' | 'referralCode'>);
  constructor(user: IUser);

  constructor(user: IUser | Omit<IUser, 'passwordHash'>) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.patronymic = user.patronymic || '';
    this.email = user.email;
    this.phone = user.phone;
    this.role = user.role || UserRole.Student;
    this.lessons = user.lessons || [];
    this.referralCode = user.referralCode || this.generateReferralCode();
    this.invitedStudents = user.invitedStudents || [];

    if ('passwordHash' in user) {
      this.passwordHash = user.passwordHash;
    }
  }

  private async isLessonExist(
    lessonId: string,
  ): Promise<IUserLessons | undefined> {
    return this.lessons.find((lesson) => lesson.lessonId === lessonId);
  }

  public async addLesson(lessonId: string) {
    if (this.isLessonExist(lessonId)) {
      throw new Error(SUCH_A_RESERVATION_ALREADY_EXISTS);
    }
    this.lessons.push({
      lessonId,
      purchaseState: PurchaseState.Started,
    });
  }

  public async deleteLesson(lessonId: string) {
    this.lessons = this.lessons.filter(
      (lesson) => lesson.lessonId !== lessonId,
    );
  }

  getLessonState(lessonId: string): PurchaseState {
    return (
      this.lessons.find((lesson) => lesson.lessonId === lessonId)
        ?.purchaseState ?? PurchaseState.Started
    );
  }

  public async getPublicProfile(): Promise<
    Omit<IUser, 'passwordHash' | 'invitedStudents'>
  > {
    return {
      _id: this._id,
      displayName: this.displayName,
      firstName: this.firstName,
      lastName: this.lastName,
      patronymic: this.patronymic,
      email: this.email,
      phone: this.phone,
      referralCode: this.referralCode,
      role: this.role,
      lessons: this.lessons,
    };
  }

  public async setPassword(password: string): Promise<this> {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async validatePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  public async updateProfile(invitedStudentId?: string): Promise<this> {
    this.invitedStudents.push(invitedStudentId);
    return this;
  }

  private generateReferralCode(): string {
    return uuidv4();
  }
}
