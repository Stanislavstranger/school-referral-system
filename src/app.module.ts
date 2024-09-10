import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { StatisticsModule } from './statistics/statistics.module';
import { LoggingMiddleware } from './middlewars/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    MongooseModule.forRootAsync(getMongoConfig()),
    AuthModule,
    PaymentModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
