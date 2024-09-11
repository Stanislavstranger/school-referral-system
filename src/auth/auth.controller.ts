import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto, ResponseRegisterDto } from './dto/register.dto';
import { LoginDto, ResponseLoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiQuery({
    name: 'referralCode',
    required: false,
    description: 'Referral code used for registration (optional)',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: ResponseRegisterDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data input' })
  @UsePipes(new ValidationPipe())
  @Post('register')
  create(
    @Body() createUserDto: RegisterDto,
    @Query('referralCode') referralCode?: string,
  ): Promise<ResponseRegisterDto> {
    return this.authService.register(createUserDto, referralCode);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has successfully logged in',
    type: ResponseLoginDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data input' })
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<ResponseLoginDto> {
    const { id } = await this.authService.validateUser(dto);
    const answer = await this.authService.login(id);
    return answer;
  }
}
