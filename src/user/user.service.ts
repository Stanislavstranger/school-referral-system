import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto, ResponseRegisterDto } from './dto/register.dto';
import { UserRepository } from './repositories/user.repository';
import {
  INVALID_REFERRAL_CODE,
  THIS_USER_ALREADY_REGISTERED,
} from './constants/user.constants';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    createUserDto: RegisterDto,
    referralCode?: string,
  ): Promise<ResponseRegisterDto> {
    let referrer = null;

    if (referralCode) {
      referrer = await this.userRepository.findUserByReferralCode(referralCode);
      if (!referrer) {
        throw new BadRequestException(INVALID_REFERRAL_CODE);
      }
    }

    const oldUser = await this.userRepository.findUserByEmail(
      createUserDto.email,
    );
    if (oldUser) {
      throw new NotFoundException(THIS_USER_ALREADY_REGISTERED);
    }

    const newUserEntity = await new UserEntity(createUserDto).setPassword(
      createUserDto.password,
    );

    const newUser = await this.userRepository.createUser(newUserEntity);

    if (referrer) {
      const invitedStudentId = String(newUser._id);
      const userEntity = await new UserEntity(referrer).updateProfile(
        invitedStudentId,
      );
      await this.userRepository.updateUser(userEntity);
    }

    return { email: newUser.email };
  }

  async findAll() {
    const allUsers = await this.userRepository.findAllUser();
    return allUsers;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findUserById(id);
    const profile = await new UserEntity(user).getPublicProfile();
    return { profile };
  }

  async remove(id: string) {
    await this.userRepository.deleteUser(id);
    return;
  }
}
