import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

declare global {
  namespace Express {
      interface Request {
          user?: User | undefined;
      }
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe);
  await app.listen(process.env.PORT);
}
bootstrap();
