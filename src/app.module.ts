import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    MongooseModule.forRootAsync(getMongoConfig()),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
