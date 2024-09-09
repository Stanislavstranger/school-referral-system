import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { THIS_USER_NOT_FOUND } from './constants/user.constants';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    const allUsers = await this.userRepository.findAllUser();
    return allUsers;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException(THIS_USER_NOT_FOUND);
    }
    const profile = await new UserEntity(user).getPublicProfile();
    return { profile };
  }

  async remove(id: string) {
    await this.userRepository.deleteUser(id);
    return;
  }
}
