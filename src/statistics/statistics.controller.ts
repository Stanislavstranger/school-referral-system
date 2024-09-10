import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';

@ApiTags('Statistics')
@ApiBearerAuth('JWT')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Get('referral')
  @ApiOperation({ summary: 'Get overall referral statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns overall statistics for the referral program',
  })
  async getReferralStatistics() {
    return this.userService.getReferralStatistics();
  }
}
