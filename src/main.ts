import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  await app.listen(port);

  Logger.log(`🚀 School referral system is running on port: ${port}`);
  Logger.log(
    `📭 API is available at: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
