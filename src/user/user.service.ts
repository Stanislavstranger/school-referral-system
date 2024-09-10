import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { THIS_USER_NOT_FOUND } from './constants/user.constants';
import { AddPaymentDto } from 'src/payment/dto/add-payment.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly logger = new Logger(UserService.name);

  async findAll() {
    const allUsers = await this.userRepository.findAllUser();
    this.logger.log(`Find all users`);
    return allUsers;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      this.logger.error(`This user not found: ${user}`);
      throw new NotFoundException(THIS_USER_NOT_FOUND);
    }
    const profile = await new UserEntity(user).getPublicProfile();
    this.logger.error(`Return user with id: ${profile._id}`);
    return { profile };
  }

  async remove(id: string) {
    await this.userRepository.deleteUser(id);
    this.logger.log(`Delete user with id: ${id}`);
    return;
  }

  async handlePayment(addPaymentDto: AddPaymentDto) {
    const { userId } = addPaymentDto;

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      this.logger.error(`This user not found: ${user}`);
      throw new NotFoundException(THIS_USER_NOT_FOUND);
    }

    const userEntity = new UserEntity(user);
    const numberOfExistingLessons = userEntity.lessons.length + 1;

    for (
      let i = numberOfExistingLessons;
      i < numberOfExistingLessons + 4;
      i++
    ) {
      await userEntity.addLesson(`lesson-${i}`);
    }

    if (userEntity.parentReferralCode) {
      const referrer = await this.userRepository.findUserByReferralCode(
        userEntity.parentReferralCode,
      );
      if (referrer) {
        const referrerEntity = new UserEntity(referrer);
        const numberOfExistingLessons = referrerEntity.lessons.length + 1;

        for (
          let i = numberOfExistingLessons;
          i < numberOfExistingLessons + 4;
          i++
        ) {
          await referrerEntity.addLesson(`lesson-${i}`);
        }
        await this.userRepository.updateUserLesson(referrerEntity);
      }
    }

    await this.userRepository.updateUser(userEntity);
    this.logger.log(`Payment processed and lesson added: ${userEntity}`);

    return { message: 'Payment processed and lessons added' };
  }

  async getReferralStatistics() {
    const allUsers = await this.userRepository.findAllUser();

    const invitedUsers = allUsers.filter((user) => user.parentReferralCode);

    const referralStatistics = invitedUsers.reduce(
      (acc, user) => {
        acc.totalInvited += 1;

        if (!acc.referrers[user.parentReferralCode]) {
          acc.referrers[user.parentReferralCode] = 1;
        } else {
          acc.referrers[user.parentReferralCode] += 1;
        }

        return acc;
      },
      {
        totalInvited: 0,
        referrers: {},
      },
    );

    this.logger.log(`Referral statistics: ${referralStatistics}`);
    return referralStatistics;
  }
}
