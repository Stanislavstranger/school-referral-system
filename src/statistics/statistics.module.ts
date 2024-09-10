import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [UserModule, CacheModule.register()],
  controllers: [StatisticsController],
  providers: [UserService],
})
export class StatisticsModule {}
