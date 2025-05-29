import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { config } from './core/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
 
  // Enable CORS
  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets'
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(config.server.port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
