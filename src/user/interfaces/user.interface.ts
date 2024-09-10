export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Canceled = 'Canceled',
}

export interface IUserLessons {
  lessonId: string;
  purchaseState: PurchaseState;
}

export interface IUser {
  _id?: string | unknown;
  displayName: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  email: string;
  phone: string;
  passwordHash: string;
  referralCode: string;
  parentReferralCode?: string;
  invitedStudents?: string[];
  role: UserRole;
  lessons?: IUserLessons[];
}
