import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [StatisticsController],
  providers: [UserService],
})
export class StatisticsModule {}
