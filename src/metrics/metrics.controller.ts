import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/interfaces/user.interface';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @UsePipes(new ValidationPipe())
  @Get()
  handleRequest() {
    this.metricsService.logHttpRequest();
    return 'Request logged';
  }
}
