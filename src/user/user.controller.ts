import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto, ResponseRegisterDto } from './dto/register.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FindUserDto } from './dto/find-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post()
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
  create(
    @Body() createUserDto: RegisterDto,
    @Query('referralCode') referralCode?: string,
  ) {
    return this.userService.create(createUserDto, referralCode);
  }

  @UsePipes(new ValidationPipe())
  @Get()
  @ApiOperation({ summary: 'Get a list of all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully',
    type: [FindUserDto],
  })
  findAll() {
    return this.userService.findAll();
  }

  @UsePipes(new ValidationPipe())
  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: String })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: FindUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to delete',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
