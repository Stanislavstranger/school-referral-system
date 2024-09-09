import { BadRequestException, Injectable } from '@nestjs/common';
import {
  INVALID_REFERRAL_CODE,
  THIS_USER_ALREADY_REGISTERED,
} from 'src/user/constants/user.constants';
import { UserEntity } from 'src/user/entities/user.entity';
import { RegisterDto, ResponseRegisterDto } from './dto/register.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { INCORRECT_LOGIN_OR_PASSWORD } from './constants/auth.constants';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, ResponseLoginDto } from './dto/login.dto';
import { IUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(
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
      throw new BadRequestException(THIS_USER_ALREADY_REGISTERED);
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

  async validateUser({ email, password }: LoginDto): Promise<{
    id: Pick<IUser, '_id'>;
  }> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(INCORRECT_LOGIN_OR_PASSWORD);
    }
    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);
    if (!isCorrectPassword) {
      throw new BadRequestException(INCORRECT_LOGIN_OR_PASSWORD);
    }
    return { id: user._id };
  }

  async login(id: Pick<IUser, '_id'>): Promise<ResponseLoginDto> {
    return {
      access_token: await this.jwtService.signAsync({ id }),
    };
  }
}