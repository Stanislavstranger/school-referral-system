import {
  Controller,
  Get,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { FindUserDto } from './dto/find-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
