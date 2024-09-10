import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(AuthService.name);

  async register(
    createUserDto: RegisterDto,
    referralCode?: string,
  ): Promise<ResponseRegisterDto> {
    let referrer = null;

    if (referralCode) {
      referrer = await this.userRepository.findUserByReferralCode(referralCode);
      if (!referrer) {
        this.logger.error(`Invalid referral code: ${referrer}`);
        throw new BadRequestException(INVALID_REFERRAL_CODE);
      }
    }

    const oldUser = await this.userRepository.findUserByEmail(
      createUserDto.email,
    );
    if (oldUser) {
      this.logger.error(`This user already registered: ${oldUser}`);
      throw new BadRequestException(THIS_USER_ALREADY_REGISTERED);
    }

    const newUserEntity = await new UserEntity({
      ...createUserDto,
      parentReferralCode: referrer ? referrer.referralCode : null,
    }).setPassword(createUserDto.password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    if (referrer) {
      const invitedStudentId = String(newUser._id);
      const userEntity = await new UserEntity(referrer).updateProfile(
        invitedStudentId,
      );
      await this.userRepository.updateUser(userEntity);
    }
    this.logger.log(`User created: ${newUser}`);
    return { email: newUser.email };
  }

  async validateUser({ email, password }: LoginDto): Promise<{
    id: Pick<IUser, '_id'>;
  }> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      this.logger.error(`Incorrect login or password: ${user}`);
      throw new BadRequestException(INCORRECT_LOGIN_OR_PASSWORD);
    }
    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);
    if (!isCorrectPassword) {
      this.logger.error(`Incorrect login or password: ${isCorrectPassword}`);
      throw new BadRequestException(INCORRECT_LOGIN_OR_PASSWORD);
    }
    this.logger.log(`User validated: ${user}`);
    return { id: user._id };
  }

  async login(id: Pick<IUser, '_id'>): Promise<ResponseLoginDto> {
    const user = await this.userRepository.findUserById(String(id));
    const payload = {
      username: user.firstName,
      sub: user._id,
      role: user.role,
    };

    this.logger.log(`User logged in: ${user}`);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
