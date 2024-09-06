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
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @Post()
  create(
    @Body() createUserDto: RegisterDto,
    @Query('referralCode') referralCode?: string,
  ) {
    return this.userService.create(createUserDto, referralCode);
  }

  @UsePipes(new ValidationPipe())
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UsePipes(new ValidationPipe())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
